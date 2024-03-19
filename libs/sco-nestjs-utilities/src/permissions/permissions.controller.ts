import { Body, Controller, Delete, Get, Param, Put, Query, Res, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission.dto';
import { IPermission } from './interface/ipermission.interface';
import { PERMISSIONS_CONSTANTS } from './constants/permissions.constants';

@Controller('api/v1/permissions')
@ApiTags('Permissions')
export class PermissionsController {
  
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({
    summary: `Fetch permissions`,
    description: 'Return permissions, it can be filtered by QUERY params',
  })
  @ApiQuery({
    description: 'Returns permissions filtered by query params, if not query params it returns all',
    type: String,
    required: false,
    name: 'query',
  })
  @ApiResponse({
    status: 200,
    description: 'Return permissions successfully',
  })
  async fetchPermisisions(@Res() res: Response, @Query() query?: any): Promise<Response<IPermission[], Record<string, IPermission[]>>> {
    return await this.permissionsService.fetchPermisisions(res, query);
  }

  @Post()
  @ApiOperation({
    summary: `Add permission`,
    description: 'Add a new permission',
  })
  @ApiBody({
    description: 'Add permission example with PermissionDto class',
    type: PermissionDto,
    examples: {
      a: {
        value: {
          name: PERMISSIONS_CONSTANTS.CREATE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Added permission successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Permission name already exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to add permission',
  })
  async addPermission(@Res() res: Response, @Body() permission: PermissionDto): Promise<Response<IPermission, Record<string, IPermission>>> {
    return await this.permissionsService.addPermission(res, permission);
  }

  @Put('/:_id')
  @ApiOperation({
    summary: `Update permission`,
    description: 'Update an existing permission',
  })
  @ApiParam({
    description: 'Permission id to update',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiBody({
    description: 'Update existing permission example using class PermissionDto',
    type: PermissionDto,
    examples: {
      a: {
        value: {
          name: PERMISSIONS_CONSTANTS.DELETE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Updated permission successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Permission name already exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Unnable to update permission',
  })
  async updatePermission(@Res() res: Response, @Param('_id') _id: string, @Body() permission: PermissionDto): Promise<Response<IPermission, Record<string, IPermission>>> {
    return await this.permissionsService.updatePermission(res, _id, permission);
  }

  @Delete('/:_id')
  @ApiOperation({
    summary: `Delete permissions`,
    description: 'Delete an existing permission',
  })
  @ApiParam({
    description: 'Permission _id to delete',
    type: String,
    required: false,
    name: '_id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted permission successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  async deletePermission(@Res() res: Response, @Param('_id') _id: string): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.permissionsService.deletePermission(res, _id);
  }
}
