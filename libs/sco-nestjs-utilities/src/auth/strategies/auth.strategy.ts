import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from '../../users/interface/iuser.interface';
import { UsersRepository } from '../../users/users.repository';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { HTTP_ERROR_CONSTANTS } from '../../constants/http-error-messages.constants';
import { AuthConfig } from '../config/auth.config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('CONFIG_OPTIONS') private options: AuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: options.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    const user = await this.usersRepository.findUserByName(payload.name);
    if (!user) {
      console.log(`[Jwt Strategy Validate] User '${payload.name} is not authorized`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
