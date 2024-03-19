import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/interface/iuser.interface';
import { TokenDto } from './dto/token.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UsersRepository } from '../users/users.repository';
import { UserDto } from '../users/dto/user.dto';
import { Request } from 'express';
import { AuthConfig } from './config/auth.config';

@Injectable()
export class AuthRepository {
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    @Inject('CONFIG_OPTIONS') private options: AuthConfig,
  ) {}

  async generateToken(user: IUser): Promise<TokenDto> {
    const payload: JwtPayload = { name: user.name };
    let token: TokenDto = undefined;

    try {
      const accessToken: string = this.jwtService.sign(payload, { 
        secret: this.options.secret,
        expiresIn: this.options.signOptions.expiresIn,
        algorithm: this.options.algorithm as any,
      });

      if (accessToken) {
        const userDto: UserDto = await this.usersRepository.modelToDto(user);
        token = new TokenDto(accessToken, 'jwt', userDto);
      }
    } catch (error) {
      console.log(`[generateToken] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
    
    return token;
  }

  async validateAccessToken(req: Request): Promise<boolean> {
    if (!req || (req && !req.headers) || (req && req.headers && !req.headers.authorization)) {
      return false;
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    if(!accessToken) {
      return false;
    }

    let decodedToken = undefined;
    try {
      decodedToken = this.jwtService.verify(accessToken, { 
        secret: this.options.secret,
      });
    } catch (error) {
      decodedToken = undefined;
    }

    if (!decodedToken) {
      return false;
    }

    const existUser = await this.usersRepository.findUserByName(decodedToken.name);
    if (!existUser) {
      return false;
    }

    return true;
  };
}
