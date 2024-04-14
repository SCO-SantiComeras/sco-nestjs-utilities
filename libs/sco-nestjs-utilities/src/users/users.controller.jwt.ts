import { Body, Controller, Delete, Get, Param, Put, Query, Res, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { IUser } from './interface/iuser.interface';
import { USERS_CONSTANTS } from './constants/user.constants';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
@ApiTags('Usuarios')
export class UsersControllerJwt {
  
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch users`,
    description: 'Return users, it can be filtered by QUERY params. Authguard required',
  })
  @ApiQuery({
    description: 'Returns users filtered by query params, if not query params it returns all',
    type: String,
    required: false,
    name: 'query',
  })
  @ApiResponse({
    status: 200,
    description: 'Return users successfully',
  })
  async fetchUsers(@Res() res: Response, @Query() query?: any): Promise<Response<IUser[], Record<string, IUser[]>>> {
    return await this.usersService.fetchUsers(res, query);
  }

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Add user`,
    description: 'Add a new user. Authguard required',
  })
  @ApiBody({
    description: 'Add user example with UserDto class',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: USERS_CONSTANTS.PUBLIC.NAME,
          password: USERS_CONSTANTS.PUBLIC.PASSWORD,
          email: USERS_CONSTANTS.PUBLIC.EMAIL,
          active: USERS_CONSTANTS.PUBLIC.ACTIVE,
          role: USERS_CONSTANTS.PUBLIC.ROLE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Added user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User name already exist,  User email already registered',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to add user',
  })
  async addUser(@Res() res: Response, @Body() user: UserDto): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.usersService.addUser(res, user);
  }

  @Put('/:_id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Update user`,
    description: 'Update an existing user. Authguard required',
  })
  @ApiParam({
    description: 'User id to update',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiBody({
    description: 'Update existing user example using class UpdateUserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          name: USERS_CONSTANTS.PUBLIC.NAME,
          password: USERS_CONSTANTS.PUBLIC.PASSWORD,
          newPassword: 'newPassword',
          email: USERS_CONSTANTS.PUBLIC.EMAIL,
          active: USERS_CONSTANTS.PUBLIC.ACTIVE,
          role: USERS_CONSTANTS.PUBLIC.ROLE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Updated user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found,  User role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User name already exist,  User email already registered',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to update user',
  })
  async updateUser(@Res() res: Response, @Param('_id') _id: string, @Body() user: UpdateUserDto): Promise<Response<IUser, Record<string, IUser>>> {
    return await this.usersService.updateUser(res, _id, user);
  }

  @Delete('/:_id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Delete user`,
    description: 'Delete an existing user. Authguard required',
  })
  @ApiParam({
    description: 'User _id to delete',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Res() res: Response, @Param('_id') _id: string): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.usersService.deleteUser(res, _id);
  }
}
