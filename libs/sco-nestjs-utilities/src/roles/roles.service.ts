import { Injectable, HttpException, HttpStatus, Param } from "@nestjs/common";
import { ControllerService } from "../shared/controller/controller.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { Response } from 'express';
import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';
import { WEBSOCKET_EVENTS } from '../websocket/constants/websocket.events';
import { RolesRepository } from "./roles.repository";
import { IRole } from "./interface/irole.interface";
import { RoleDto } from "./dto/role.dto";
import { IPermission } from "../permissions/interface/ipermission.interface";
import { PermissionsRepository } from "../permissions/permissions.repository";

@Injectable()
export class RolesService {

    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly controllerService: ControllerService,
        private readonly websocketsService: WebsocketGateway,
        private readonly permissionsRepository: PermissionsRepository,
    ) {}

    async fetchRoles(res: Response, query?: any): Promise<Response<IRole[], Record<string, IRole[]>>> {
        const filter = query && query.query ? await this.controllerService.getParamsFromSwaggerQuery(query.query) : query;
        const roles: IRole[] = await this.rolesRepository.fetchRoles(filter);
        return res.status(200).json(roles);
    }

    async addRole(res: Response, role: RoleDto): Promise<Response<IRole, Record<string, IRole>>> {
        const exitRoleName: IRole = await this.rolesRepository.findRoleByName(role.name);
        if (exitRoleName) {
            console.error('[addRole] Role already exist');
            throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.ROLE_ALREADY_EXIST, HttpStatus.CONFLICT);
        }

        if (role.permissions && role.permissions.length > 0) {
            for (const permission of role.permissions) {
                const existPermission: IPermission = await this.permissionsRepository.findPermissionByName(permission.name);
                if (!existPermission) {
                    console.error('[addRole] Permission not found');
                    throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
                }
            }
        }

        const createdRole: IRole = await this.rolesRepository.addRole(role);
        if (!createdRole) { 
            console.log('[addRole] Role to create permission');
            throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.CREATE_ROLE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_ROLES);
        return res.status(200).json(createdRole);
    }

    async updateRole(res: Response, @Param('_id') _id: string, role: RoleDto): Promise<Response<IRole, Record<string, IRole>>> {
        const existRole: IRole = await this.rolesRepository.findRole(_id);
        if (!existRole) {
            console.log(`[updateRole] Role not found`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (role.name != existRole.name) {
            const existNewName: IRole = await this.rolesRepository.findRoleByName(role.name);
            if (existNewName) {
                console.log('[updateRole] Role already registered');
                throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.ROLE_ALREADY_EXIST, HttpStatus.CONFLICT);
            }
        }

        if (role.permissions && role.permissions.length > 0) {
            for (const permission of role.permissions) {
                const existPermission: IPermission = await this.permissionsRepository.findPermissionByName(permission.name);
                if (!existPermission) {
                    console.error('[updateRole] Permission not found');
                    throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
                }
            }
        }

        const updatedRole: IRole = await this.rolesRepository.updateRole(_id, role);
        if (!updatedRole) {
            console.log('[updateRole] Unnable to update role');
            throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.UPDATE_ROLE_ERROR, HttpStatus.CONFLICT);
        }

        await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_ROLES);
        return res.status(200).json(updatedRole);
    }

    async deleteRole(res: Response, _id: string): Promise<Response<boolean, Record<string, boolean>>> {
        const existRole: IRole = await this.rolesRepository.findRole(_id);
        if (!existRole) {
            console.log(`[deleteRole] Role not found`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.ROLES.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        try {
            const deletedRole: boolean = await this.rolesRepository.deleteRole(_id);
            if (deletedRole) {
                await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_ROLES);
            }
            return res.status(200).json(deletedRole);
        } catch (error) {
            throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
