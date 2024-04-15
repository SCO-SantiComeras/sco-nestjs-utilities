import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { IRole } from "./interface/irole.interface";
import { RoleDto } from "./dto/role.dto";
import { PermissionsRepository } from "../permissions/permissions.repository";
import { PermissionDto } from "../permissions/dto/permission.dto";
import { MONGODB_CONSTANTS } from "../mongo-db/mongo-db.constants";

@Injectable()
export class RolesRepository {
  
  constructor(
    @Inject('MODEL') private readonly RoleModel: Model<IRole>,
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async fetchRoles(where?: any): Promise<IRole[]> {
    try {
      return await this.RoleModel.find(where).populate("permissions");
    } catch (error) {
      console.log(`[fetchRoles] Error: ${JSON.stringify(error)}`);
      return [];
    }
  }

  async addRole(role: RoleDto): Promise<IRole> {
    try {
      const RoleModel = new this.RoleModel({
        name: role.name,
        permissions: role.permissions && role.permissions.length > 0 ? role.permissions : [],
      });

      const savedRole: IRole = await RoleModel.save();
      if (!savedRole) {
        console.log(`[addRole] Role: ${savedRole.name} unnable to create`);
        return undefined;
      }
      console.log(`[addRole] Role: ${savedRole.name} created successfully`);

      return savedRole;
    } catch (error) {
      console.log(`[addRole] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async updateRole(_id: string, role: RoleDto): Promise<IRole> {
    try {
      const result = await this.RoleModel.updateOne(
        {
          _id: _id,
        },
        { 
          $set: {
            name: role.name,
            permissions: role.permissions,
          }
        }
      );

      if (!result || (result && result.nModified != 1)) {
        console.log(`[updateRole] Role: ${role.name} unnable to update`);
        return undefined;
      }
      console.log(`[updateRole] Role: ${role.name} updated successfully`);

      return await this.findRole(_id);
    } catch (error) {
      console.log(`[updateRole] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async deleteRole(_id: string): Promise<boolean> {
    try {
      const result = await this.RoleModel.deleteOne({ _id });

      if (!result || (result && result.deletedCount != 1)) {
        console.log(`[deleteRole] Role: ${_id} unnable to delete`);
        return false;
      }
      console.log(`[deleteRole] Role: ${_id} deleted successfully`);

      return true;
    } catch (error) {
      console.log(`[deleteRole] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async findRole(_id: string): Promise<IRole> {
    try {
      return await this.RoleModel.findOne({ _id: _id }).populate("permissions");
    } catch (error) {
      console.log(`[findRole] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findRoleByName(name: string): Promise<IRole> {
    try {
      return await this.RoleModel.findOne({ name: name }).populate("permissions");
    } catch (error) {
      console.log(`[findRoleByName] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async modelToDto(role: IRole): Promise<RoleDto> {
    let permissionsDtos: PermissionDto[] = [];

    if (role.permissions && role.permissions.length > 0) {
      for (const permission of role.permissions) {
        permissionsDtos.push(
          await this.permissionsRepository.modelToDto(
            await this.permissionsRepository.findPermissionByName(permission["name"])
          )
        );
      }
    }

    const RoleDto: RoleDto = {
      _id: role._id ? role._id : undefined, 
      name: role.name,
      permissions: permissionsDtos,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      typeObj: role.typeObj ? role.typeObj : MONGODB_CONSTANTS.ROLES.MODEL, 
    }

    return RoleDto;
  }
}
