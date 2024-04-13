import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { UsersRepository } from '../users/users.repository';
import { TokenDto } from './dto/token.dto';
import { IUser } from '../users/interface/iuser.interface';
import { Response, Request } from 'express';
import { BcryptService } from '../shared/bcrypt/bcrypt.service';
import { UserDto } from '../users/dto/user.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { WEBSOCKET_EVENTS } from '../websocket/constants/websocket.events';
import { AuthConfig } from './config/auth.config';
import { RolesRepository } from '../roles/roles.repository';
import { IRole } from '../roles/interface/irole.interface';

export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly bcryptService: BcryptService,
    private readonly websocketsService: WebsocketGateway,
    @Inject('CONFIG_OPTIONS') private options: AuthConfig,
  ) {}

  async login(res: Response, login: LoginDto): Promise<Response<TokenDto, Record<string, TokenDto>>> {
    const existUser: IUser = login.name.includes('@') 
      ? await this.usersRepository.findUserByEmail(login.name)
      : await this.usersRepository.findUserByName(login.name);
    
    if (!existUser) {
      console.log(`[login] User '${login.name}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const credentialsOK: boolean = await this.bcryptService.comparePasswords(login.password, existUser);
    if (!credentialsOK) {
      console.log(`[login] Invalid credentials`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (existUser.active == false && !this.options.newUserActived) {
      console.log(`[login] User '${existUser.name}' not actived`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.USER_NOT_ACTIVED, HttpStatus.UNAUTHORIZED);
    }

    const token: TokenDto = await this.authRepository.generateToken(existUser);
    if (!token) {
      console.log(`[login] Unnable to generate user token`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNNABLE_USER_TOKEN, HttpStatus.CONFLICT);
    }

    return res.status(200).json(token);
  }

  async register(res: Response, user: UserDto): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersRepository.findUserByName(user.name);
    if (existUser) {
      console.log(`[register] User '${user.name}' already exist`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const existEmail: IUser = await this.usersRepository.findUserByEmail(user.email);
    if (existEmail) {
      console.log(`[register] Email '${user.email}' already exist`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const existRole: IRole = await this.rolesRepository.findRoleByName(user.role.name);
    if (!existRole) {
      console.log(`[register] Role '${user.role.name}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    user.role = await this.rolesRepository.modelToDto(existRole);
    user.active = this.options.newUserActived ? true : user.active != undefined ? user.active : false;

    const createdUser: IUser = await this.usersRepository.addUser(user);
    if (!createdUser) {
      console.log(`[register] User '${user.name}' unnable to create`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.CREATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    console.log(`[register] User '${user.name}' created successfully`);
    await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
    return res.status(200).json(createdUser);
  }

  async requestPassword(res: Response, email: string): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersRepository.findUserByEmail(email);
    if (!existUser) {
      console.log(`[requestPassword] Email '${email}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    existUser.pwdRecoveryToken = await this.bcryptService.generateToken();
    existUser.pwdRecoveryDate = new Date();

    const userDto: UserDto = await this.usersRepository.modelToDto(existUser);
    const updatedUser: IUser = await this.usersRepository.updateUser(userDto._id, userDto);
    if (!updatedUser) {
      console.log(`[requestPassword] User '${userDto.name}' unnable to update`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.UPDATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
    return res.status(200).json(updatedUser);
  }

  async resetPassword(res: Response, pwdRecoveryToken: string, user: UserDto): Promise<Response<boolean, Record<string, boolean>>> {
    const users: IUser[] = await this.usersRepository.fetchUsers({ pwdRecoveryToken: pwdRecoveryToken });
    if (!users || (users && users.length == 0)) {
      console.log(`[resetPassword] User '${user.name}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    users[0].pwdRecoveryToken = null;
    users[0].pwdRecoveryDate = null;
    users[0].password = await this.bcryptService.encryptPassword(user.password);

    const userDto: UserDto = await this.usersRepository.modelToDto(users[0]);
    const updatedUser: IUser = await this.usersRepository.updateUser(userDto._id, userDto, true);
    if (!updatedUser) {
      console.log(`[resetPassword] User '${userDto.name}' unnable to update`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.UPDATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
    return res.status(200).json(true);
  }

  async getUserRecoveryPassword(res: Response, pwdRecoveryToken: string): Promise<Response<IUser, Record<string, IUser>>> {
    const users: IUser[] = await this.usersRepository.fetchUsers({ pwdRecoveryToken: pwdRecoveryToken });
    if (!users || (users && users.length == 0)) {
      console.log(`[getUserRecoveryPassword] User recovery token '${pwdRecoveryToken}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return res.status(200).json(users[0]);
  }

  async getUserEmail(res: Response, email: string): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersRepository.findUserByEmail(email);
    if (!existUser) {
      console.log(`[getUserEmail] User email '${email}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return res.status(200).json(existUser);
  }

  async confirmEmail(res: Response, email: string): Promise<Response<IUser, Record<string, IUser>>> {
    const existUser: IUser = await this.usersRepository.findUserByEmail(email);
    if (!existUser) {
      console.log(`[confirmEmail] User email '${email}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    existUser.active = true;

    const userDto: UserDto = await this.usersRepository.modelToDto(existUser);
    const updatedUser: IUser = await this.usersRepository.updateUser(userDto._id, userDto);
    if (!updatedUser) {
      console.log(`[confirmEmail] User '${userDto.name}' unnable to update`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.UPDATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
    return res.status(200).json(true);
  }

  async validateToken(req: Request, res: Response, user: UserDto): Promise<Response<TokenDto, Record<string, TokenDto>>> {
    const existUser: IUser = await this.usersRepository.findUserByName(user.name);
    if (!existUser) {
      console.log(`[validateToken] User '${user.name}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const result: boolean = await this.authRepository.validateAccessToken(req);
    if (!result) {
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    const token: TokenDto = await this.authRepository.generateToken(existUser);
    if (!token) {
      console.log(`[validateToken] Unnable to generate user token`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNNABLE_USER_TOKEN, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return res.status(200).json(token);
  }
}
