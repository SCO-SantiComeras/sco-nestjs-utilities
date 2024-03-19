import { Controller, Post, Body, Res, Get, Param, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/interface/iuser.interface';
import { USERS_CONSTANTS } from '../users/constants/user.constants';
import { Response, Request } from 'express';
import { UserDto } from '../users/dto/user.dto';

@Controller('api/v1/auth')
@ApiTags('Autentificación')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: `Login`,
    description: 'Start session with user in application',
  })
  @ApiBody({
    description: 'Start session example using class LoginDto',
    type: LoginDto,
    examples: {
      a: {
        value: {
          name: USERS_CONSTANTS.PUBLIC.NAME,
          password: USERS_CONSTANTS.PUBLIC.PASSWORD,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Start session successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials,  User not actived',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to create user token',
  })
  async login(@Res() res: Response, @Body() login: LoginDto): Promise<Response<TokenDto, Record<string, TokenDto>>> {
    return await this.authService.login(res, login);
  }

  
  @Post('register')
  @ApiOperation({
    summary: `Register`,
    description: 'Register new user',
  })
  @ApiBody({
    description: 'Register user example using class UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: USERS_CONSTANTS.PUBLIC.NAME,
          email: USERS_CONSTANTS.PUBLIC.EMAIL,
          role: USERS_CONSTANTS.PUBLIC.ROLE,
          password: USERS_CONSTANTS.PUBLIC.PASSWORD,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Registered user successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User already registered,  Email already registered',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to register user',
  })
  async register(@Res() res: Response, @Body() user: UserDto): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.authService.register(res, user);
  }

  @Get('request-password/:email')
  @ApiOperation({
    summary: `Request password`,
    description: 'Request of reset password',
  })
  @ApiParam({
    description: 'User email',
    type: String,
    required: false,
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password token created successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to update user',
  })
  async requestPassword(@Res() res: Response, @Param('email') email: string): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.authService.requestPassword(res, email);
  }

  @Put('reset-password/:pwdRecoveryToken')
  @ApiOperation({
    summary: `Reset password`,
    description: 'Reset user password',
  })
  @ApiParam({
    description: 'Reset password token',
    type: String,
    required: false,
    name: 'pwdRecoveryToken',
  })
  @ApiBody({
    description: 'Reset password user example using class UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: USERS_CONSTANTS.PUBLIC.NAME,
          email: USERS_CONSTANTS.PUBLIC.EMAIL,
          role: USERS_CONSTANTS.PUBLIC.ROLE,
          password: 'newPassword',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to update user',
  })
  async resetPassword(
    @Res() res: Response, 
    @Param('pwdRecoveryToken') pwdRecoveryToken: string, 
    @Body() user: UserDto
  ): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.authService.resetPassword(res, pwdRecoveryToken, user);
  }

  @Get('getUserRecoveryPassword/:pwdRecoveryToken')
  @ApiOperation({
    summary: `Get User Recovery Password`,
    description: 'Return user by reset password token',
  })
  @ApiParam({
    description: 'Reset pssword token',
    type: String,
    required: false,
    name: 'pwdRecoveryToken',
  })
  @ApiResponse({
    status: 200,
    description: 'Return user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserRecoveryPassword(@Res() res: Response, @Param('pwdRecoveryToken') pwdRecoveryToken: string): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.authService.getUserRecoveryPassword(res, pwdRecoveryToken);
  }

  @Get('getUserEmail/:email')
  @ApiOperation({
    summary: `Get User Email`,
    description: 'Return user by email',
  })
  @ApiParam({
    description: 'User emial',
    type: String,
    required: false,
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Return user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserEmail(@Res() res: Response, @Param('email') email: string): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.authService.getUserEmail(res, email);
  }

  @Get('confirmEmail/:email')
  @ApiOperation({
    summary: `Confirm email`,
    description: 'Confirm user email and activate user',
  })
  @ApiParam({
    description: 'User email',
    type: String,
    required: false,
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'User email confirmed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to update user',
  })
  async confirmEmail(@Res() res: Response, @Param('email') email: string): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.authService.confirmEmail(res, email);
  }

  @Post('validate-token')
  @ApiOperation({
    summary: `Validate token`,
    description: 'Validate user token expiration',
  })
  @ApiBody({
    description: 'Validate user token expiration using class UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: USERS_CONSTANTS.PUBLIC.NAME,
          email: USERS_CONSTANTS.PUBLIC.EMAIL,
          role: USERS_CONSTANTS.PUBLIC.ROLE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User token validate successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Session time has expired',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible crear el nuevo token',
  })
  async validateToken(@Req() req: Request, @Res() res: Response, @Body() user: UserDto): Promise<Response<TokenDto, Record<string, TokenDto>>> {
    return await this.authService.validateToken(req, res, user);
  }
}
