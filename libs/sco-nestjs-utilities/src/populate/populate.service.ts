import { Inject, Injectable } from "@nestjs/common";
import { PopulateConfig } from "./populate.config";
import { PermissionsRepository } from "../permissions/permissions.repository";
import { PERMISSIONS_CONSTANTS } from "../permissions/constants/permissions.constants";
import { IPermission } from "../permissions/interface/ipermission.interface";
import { ROLES_CONSTANTS } from "../roles/constants/roles.constants";
import { IRole } from "../roles/interface/irole.interface";
import { RolesRepository } from "../roles/roles.repository";
import { PermissionDto } from "../permissions/dto/permission.dto";
import { USERS_CONSTANTS } from '../users/constants/user.constants';
import { IUser } from '../users/interface/iuser.interface';
import { UsersRepository } from '../users/users.repository';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class PopulateService {

  private _populate: boolean;

  constructor(
    @Inject('CONFIG_OPTIONS') private options: PopulateConfig,
    private readonly permissinsRepositroy: PermissionsRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly usersRepository: UsersRepository,
  ) { 
    this._populate = this.options.populate;
  }

  async onModuleInit() {
    if (this._populate) {
      await this.populatePermissions();
      await this.populateRoles();
      await this.populateUsers();
    }
  }

  async populatePermissions() {
    for (const permConst of Object.values(PERMISSIONS_CONSTANTS)) {
      const existPermissions: IPermission = await this.permissinsRepositroy.findPermissionByName(permConst);
      if (!existPermissions) {
        await this.permissinsRepositroy.addPermission({ name: permConst });
      }
    }
  }

  async populateRoles() {
    for (const roleConst of Object.values(ROLES_CONSTANTS)) {
      const existRole: IRole = await this.rolesRepository.findRoleByName(roleConst.NAME);
      if (!existRole) {
        let permissions: PermissionDto[] = [];

        for (const permission of Object.values(roleConst.PERMISSIONS)) {
          const existPermissin: IPermission = await this.permissinsRepositroy.findPermissionByName(permission.name);
          if (existPermissin) {
            permissions.push(await this.permissinsRepositroy.modelToDto(existPermissin));
          }
        }

        await this.rolesRepository.addRole({
          name: roleConst.NAME,
          permissions: permissions,
        });
      }
    }
  }

  async populateUsers() {
    for (const userConst of Object.values(USERS_CONSTANTS)) {
      const existUser: IUser = await this.usersRepository.findUserByName(userConst.NAME);

      if (!existUser) {
        const existRole: IRole = await this.rolesRepository.findRoleByName(userConst.ROLE.name);
        if (!existRole) {
          continue;
        }

        const UserDto: UserDto = {
          name: userConst.NAME,
          email: userConst.EMAIL,
          password: userConst.PASSWORD,
          active: userConst.ACTIVE,
          role: await this.rolesRepository.modelToDto(existRole),
        }

        await this.usersRepository.addUser(UserDto);
      }
    }
  }
}
