import { Inject, Injectable, HttpException, HttpStatus, Param } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { ControllerService } from "../shared/controller/controller.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { BcryptService } from "../shared/bcrypt/bcrypt.service";
import { UsersConfig } from "./config/users.config";
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';
import { WEBSOCKET_EVENTS } from '../websocket/constants/websocket.events';
import { IUser } from './interface/iuser.interface';
import { UserDto } from './dto/user.dto';
import { ROLES_CONSTANTS } from "../roles/constants/roles.constants";

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly controllerService: ControllerService,
        private readonly websocketsService: WebsocketGateway,
        private readonly bcryptService: BcryptService,
        @Inject('CONFIG_OPTIONS') private options: UsersConfig,
    ) {}

    async fetchUsers(res: Response, query?: any): Promise<Response<IUser[], Record<string, IUser[]>>> {
        const filter = query && query.query ? await this.controllerService.getParamsFromSwaggerQuery(query.query) : query;
        const users: IUser[] = await this.usersRepository.fetchUsers(filter);
        return res.status(200).json(users);
    }

    async addUser(res: Response, user: UserDto): Promise<Response<IUser, Record<string, IUser>>> {
        const existUserName: IUser = await this.usersRepository.findUserByName(user.name);
        if (existUserName) {
            console.error('[addUser] User already exist');
            throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_ALREADY_EXIST, HttpStatus.CONFLICT);
        }

        const existUserEmail: IUser = await this.usersRepository.findUserByEmail(user.email);
        if (existUserEmail) {
            console.log('[addUser] Email already registered');
            throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
        }

        /* user.role = user.role ? user.role : { name: ROLES_CONSTANTS.USER.NAME }; */
        if (this.options.newUserActived) {
            user.active = user.active == false || user.active == true ? user.active : true;
        } else {
            user.active = false;
        }

        const createdUser: IUser = await this.usersRepository.addUser(user);
        if (!createdUser) { 
            console.log('[addUser] Unnable to create user');
            throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.CREATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
        return res.status(200).json(createdUser);
    }

    async updateUser(res: Response, @Param('_id') _id: string, user: UpdateUserDto): Promise<Response<IUser, Record<string, IUser>>> {
        const existUser: IUser = await this.usersRepository.findUser(_id);
        if (!existUser) {
            console.log(`[updateUser] User not found`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (user.name != existUser.name) {
            const existNewName: IUser = await this.usersRepository.findUserByName(user.name);
            if (existNewName) {
                console.log('[updateUser] Name already registered');
                throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.NAME_ALREADY_EXIST, HttpStatus.CONFLICT);
            }
        }

        if (user.email != existUser.email) {
            const existNewEmail: IUser = await this.usersRepository.findUserByEmail(user.email);
            if (existNewEmail) {
                console.log('[updateUser] Email already registered');
                throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
            }
        }

        let updatePassword: boolean = false;
        if (user.password && user.newPassword) {
            const encryptedNewPassword: string = await this.bcryptService.encryptPassword(user.newPassword);
            if (encryptedNewPassword) {
                user.password = encryptedNewPassword;
                updatePassword = true;
            }
        }

        const updatedUser: IUser = await this.usersRepository.updateUser(_id, user, updatePassword);
        if (!updatedUser) {
            console.log('[updateUser] Unnable to update user');
            throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.UPDATE_USER_ERROR, HttpStatus.CONFLICT);
        }

        await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
        return res.status(200).json(updatedUser);
    }

    async deleteUser(res: Response, _id: string): Promise<Response<boolean, Record<string, boolean>>> {
        const existUser: IUser = await this.usersRepository.findUser(_id);
        if (!existUser) {
            console.log(`[deleteUser] User not found`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        try {
            const deletedUser: boolean = await this.usersRepository.deleteUser(_id);
            if (deletedUser) {
            await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_USERS);
            }
            return res.status(200).json(deletedUser);
        } catch (error) {
            throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
