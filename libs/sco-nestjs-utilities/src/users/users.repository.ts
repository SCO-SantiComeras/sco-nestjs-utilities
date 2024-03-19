import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { IUser } from './interface/iuser.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { USERS_CONSTANTS } from './constants/user.constants';
import { MONGODB_CONSTANTS } from '../mongo-db/mongo-db.constants';
import { ROLES_CONSTANTS } from '../roles/constants/roles.constants';
import { RolesRepository } from '../roles/roles.repository';
import { RoleDto } from '../roles/dto/role.dto';
import { IRole } from '../roles/interface/irole.interface';

@Injectable()
export class UsersRepository {
  
  constructor(
    @Inject('MODEL') private readonly UserModel: Model<IUser>,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async fetchUsers(where?: any): Promise<IUser[]> {
    if (!where.name) {
      where.name = { $ne: USERS_CONSTANTS.SUPERADMIN.NAME };
    } else {
      const any = { $ne: USERS_CONSTANTS.SUPERADMIN.NAME, $eq: where.name };
      where.name = any;
    }

    try {
      return await this.UserModel.find(where, { password: 0 }).populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
    } catch (error) {
      console.log(`[fetchAllUsers] Error: ${JSON.stringify(error)}`);
      return [];
    }
  }

  async addUser(user: UserDto): Promise<IUser> {
    try {
      const userModel = new this.UserModel({
        name: user.name,
        password: user.password,
        email: user.email,
        active: user.active != undefined ? user.active : false,
        role: user.role ? user.role : { name: ROLES_CONSTANTS.USER},
        pwdRecoveryToken: undefined,
        pwdRecoveryDate: undefined,
        extension: user.extension ? user.extension : {},
      });

      const savedUser: IUser = await userModel.save();
      if (!savedUser) {
        console.log(`[addUser] User: ${savedUser.name} unnable to create`);
        return undefined;
      }
      console.log(`[addUser] User: ${savedUser.name} created successfully`);

      savedUser.password = undefined;
      return savedUser;
    } catch (error) {
      console.log(`[addUser] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async updateUser(_id: string, user: UpdateUserDto, updatePassword: boolean = false): Promise<IUser> {
    const set: any = {
      name: user.name,
      email: user.email,
      active: user.active,
      role: user.role,
      pwdRecoveryToken: user.pwdRecoveryToken,
      pwdRecoveryDate: user.pwdRecoveryDate,
    }

    if (user.extension) {
      set.extension = user.extension;
    }

    if (updatePassword) {
      set.password = user.password;
    }

    try {
      const result = await this.UserModel.updateOne(
        {
          _id: _id,
        },
        { 
          $set: set
        }
      );

      if (!result || (result && result.nModified != 1)) {
        console.log(`[updateUser] User: ${_id} unnable to update`);
        return undefined;
      }
      console.log(`[updateUser] User: ${_id} updated successfully`);

      return await this.findUser(_id);
    } catch (error) {
      console.log(`[updateUser] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async deleteUser(_id: string): Promise<boolean> {
    try {
      const result = await this.UserModel.deleteOne({ _id });

      if (!result || (result && result.deletedCount != 1)) {
        console.log(`[deleteUser] User: ${_id} unnable to delete`);
        return false;
      }
      console.log(`[deleteUser] User: ${_id} deleted successfully`);

      return true;
    } catch (error) {
      console.log(`[deleteUser] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
  }

  async findUser(_id: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ _id: _id }).populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
    } catch (error) {
      console.log(`[findUser] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findUserByName(name: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ name: name }).populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
    } catch (error) {
      console.log(`[findUserByName] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async findUserByEmail(email: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ email: email }).populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
    } catch (error) {
      console.log(`[findUserByEmail] Error: ${JSON.stringify(error)}`);
      return undefined;
    }
  }

  async modelToDto(user: IUser): Promise<UserDto> {
    let roleDto: RoleDto = undefined;
    if (user.role && user.role["_id"]) {
      const existRole: IRole = await this.rolesRepository.findRole(user.role["_id"]);
      if (existRole) {
        roleDto = await this.rolesRepository.modelToDto(existRole);
      }
    }

    const UserDto: UserDto = {
      _id: user._id ? user._id : undefined, 
      name: user.name,
      password: user.password ? user.password : undefined,
      email: user.email,
      active: user.active,
      role: roleDto,
      pwdRecoveryToken: user.pwdRecoveryToken,
      pwdRecoveryDate: user.pwdRecoveryDate,
      typeObj: user.typeObj ? user.typeObj : MONGODB_CONSTANTS.USERS.MODEL, 
    }

    return UserDto;
  }
}
