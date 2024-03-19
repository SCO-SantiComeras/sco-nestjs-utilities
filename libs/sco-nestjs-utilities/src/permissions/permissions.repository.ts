import { Inject, Injectable } from "@nestjs/common";
import { IPermission } from "./interface/ipermission.interface";
import { Model } from "mongoose";
import { PermissionDto } from "./dto/permission.dto";
import { MONGODB_CONSTANTS } from "../mongo-db/mongo-db.constants";

@Injectable()
export class PermissionsRepository {
  
  constructor(@Inject('MODEL') private readonly PermissionModel: Model<IPermission>) {}

  async fetchPermisisions(where?: any): Promise<IPermission[]> {
    try {
      return await this.PermissionModel.find(where);
    } catch (error) {
      console.log(`[fetchPermisisions] Error: ${JSON.stringify(error)}`);
      return [];
    }
  }

  async addPermission(permission: PermissionDto): Promise<IPermission> {
    try {
      const PermissionModel = new this.PermissionModel({
        name: permission.name,
      });

      const savedPermission: IPermission = await PermissionModel.save();
      if (!savedPermission) {
        console.log(`[addPermission] Permission: ${savedPermission.name} unnable to create`);
        return undefined;
      }
      console.log(`[addPermission] Permission: ${savedPermission.name} created successfully`);

      return savedPermission;
    } catch (error) {
      console.log(`[addPermission] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async updatePermission(_id: string, permission: PermissionDto): Promise<IPermission> {
    try {
      const result = await this.PermissionModel.updateOne(
        {
          _id: _id,
        },
        { 
          $set: {
            name: permission.name
          }
        }
      );

      if (!result || (result && result.nModified != 1)) {
        console.log(`[updatePermission] Permission: ${permission.name} unnable to update`);
        return undefined;
      }
      console.log(`[updatePermission] Permission: ${permission.name} updated successfully`);

      return await this.findPermission(_id);
    } catch (error) {
      console.log(`[updatePermission] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async deletePermission(_id: string): Promise<boolean> {
    try {
      const result = await this.PermissionModel.deleteOne({ _id });

      if (!result || (result && result.deletedCount != 1)) {
        console.log(`[deletePermission] Permission: ${_id} unnable to delete`);
        return false;
      }
      console.log(`[deletePermission] Permission: ${_id} deleted successfully`);

      return true;
    } catch (error) {
      console.log(`[deletePermission] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async findPermission(_id: string): Promise<IPermission> {
    try {
      return await this.PermissionModel.findOne({ _id: _id });
    } catch (error) {
      console.log(`[findPermission] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findPermissionByName(name: string): Promise<IPermission> {
    try {
      return await this.PermissionModel.findOne({ name: name });
    } catch (error) {
      console.log(`[findUserByName] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async modelToDto(permission: IPermission): Promise<PermissionDto> {
    const PermissionDto: PermissionDto = {
      _id: permission._id ? permission._id : undefined, 
      name: permission.name,
      typeObj: permission.typeObj ? permission.typeObj : MONGODB_CONSTANTS.PERMISSIONS.MODEL, 
    }

    return PermissionDto;
  }
}
