import { Body, Controller, Delete, Get, Param, Put, Query, Res, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { IRole } from './interface/irole.interface';
import { RoleDto } from './dto/role.dto';
import { PERMISSIONS_CONSTANTS } from '../permissions/constants/permissions.constants';
import { ROLES_CONSTANTS } from './constants/roles.constants';

@Controller('api/v1/roles')
@ApiTags('Roles')
export class RolesController {
  
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: `Fetch roles`,
    description: 'Return roles, it can be filtered by QUERY params',
  })
  @ApiQuery({
    description: 'Returns roles filtered by query params, if not query params it returns all',
    type: String,
    required: false,
    name: 'query',
  })
  @ApiResponse({
    status: 200,
    description: 'Return roles successfully',
  })
  async fetchRoles(@Res() res: Response, @Query() query?: any): Promise<Response<IRole[], Record<string, IRole[]>>> {
    return await this.rolesService.fetchRoles(res, query);
  }

  @Post()
  @ApiOperation({
    summary: `Add role`,
    description: 'Add a new role',
  })
  @ApiBody({
    description: 'Add role example with RoleDto class',
    type: RoleDto,
    examples: {
      a: {
        value: {
          name: ROLES_CONSTANTS.USER.NAME,
          permission: [
            { name: PERMISSIONS_CONSTANTS.READ },
          ]
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Added role successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'role name already exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to add role',
  })
  async addRole(@Res() res: Response, @Body() role: RoleDto): Promise<Response<IRole, Record<string, IRole>>> {
    return await this.rolesService.addRole(res, role);
  }

  @Put('/:_id')
  @ApiOperation({
    summary: `Update role`,
    description: 'Update an existing role',
  })
  @ApiParam({
    description: 'Role id to update',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiBody({
    description: 'Update existing role example using class RoleDto',
    type: RoleDto,
    examples: {
      a: {
        value: {
          name: ROLES_CONSTANTS.USER.NAME,
          permission: [
            { name: PERMISSIONS_CONSTANTS.READ },
          ]
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Updated role successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Role name already exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to update role',
  })
  async updateRole(@Res() res: Response, @Param('_id') _id: string, @Body() role: RoleDto): Promise<Response<IRole, Record<string, IRole>>> {
    return await this.rolesService.updateRole(res, _id, role);
  }

  @Delete('/:_id')
  @ApiOperation({
    summary: `Delete role`,
    description: 'Delete an existing role',
  })
  @ApiParam({
    description: 'Role _id to delete',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted role successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async deleteRole(@Res() res: Response, @Param('_id') _id: string): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.rolesService.deleteRole(res, _id);
  }
}
