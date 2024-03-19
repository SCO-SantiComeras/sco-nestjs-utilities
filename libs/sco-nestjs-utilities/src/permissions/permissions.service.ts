import { Injectable, HttpException, HttpStatus, Param } from "@nestjs/common";
import { ControllerService } from "../shared/controller/controller.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { Response } from 'express';
import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';
import { WEBSOCKET_EVENTS } from '../websocket/constants/websocket.events';
import { PermissionsRepository } from "./permissions.repository";
import { IPermission } from "./interface/ipermission.interface";
import { PermissionDto } from "./dto/permission.dto";

@Injectable()
export class PermissionsService {

    constructor(
        private readonly permissionsRepository: PermissionsRepository,
        private readonly controllerService: ControllerService,
        private readonly websocketsService: WebsocketGateway,
    ) {}

    async fetchPermisisions(res: Response, query?: any): Promise<Response<IPermission[], Record<string, IPermission[]>>> {
        const filter = query && query.query ? await this.controllerService.getParamsFromSwaggerQuery(query.query) : query;
        const permissions: IPermission[] = await this.permissionsRepository.fetchPermisisions(filter);
        return res.status(200).json(permissions);
    }

    async addPermission(res: Response, permission: PermissionDto): Promise<Response<IPermission, Record<string, IPermission>>> {
        const existPermimssionName: IPermission = await this.permissionsRepository.findPermissionByName(permission.name);
        if (existPermimssionName) {
            console.error('[addPermission] Permission already exist');
            throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.PERMISSION_ALREADY_EXIST, HttpStatus.CONFLICT);
        }

        const createdPermission: IPermission = await this.permissionsRepository.addPermission(permission);
        if (!createdPermission) { 
            console.log('[addPermission] Unnable to create permission');
            throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.CREATE_PERMISSION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_PERMISSIONS);
        return res.status(200).json(createdPermission);
    }

    async updatePermission(res: Response, @Param('_id') _id: string, permission: PermissionDto): Promise<Response<IPermission, Record<string, IPermission>>> {
        const existPermission: IPermission = await this.permissionsRepository.findPermission(_id);
        if (!existPermission) {
            console.log(`[updatePermission] Permission not found`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (permission.name != existPermission.name) {
            const existNewName: IPermission = await this.permissionsRepository.findPermissionByName(permission.name);
            if (existNewName) {
                console.log('[updatePermission] Name already registered');
                throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.PERMISSION_ALREADY_EXIST, HttpStatus.CONFLICT);
            }
        }

        const updatedPermission: IPermission = await this.permissionsRepository.updatePermission(_id, permission);
        if (!updatedPermission) {
            console.log('[updatePermission] Unnable to update permission');
            throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.UPDATE_PERMISSION_ERROR, HttpStatus.CONFLICT);
        }

        await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_PERMISSIONS);
        return res.status(200).json(updatedPermission);
    }

    async deletePermission(res: Response, _id: string): Promise<Response<boolean, Record<string, boolean>>> {
        const existPermission: IPermission = await this.permissionsRepository.findPermission(_id);
        if (!existPermission) {
            console.log(`[deletePermission] Permission not found`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.PERMISSIONS.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        try {
            const deletedPermission: boolean = await this.permissionsRepository.deletePermission(_id);
            if (deletedPermission) {
                await this.websocketsService.notifyWebsockets(WEBSOCKET_EVENTS.WS_PERMISSIONS);
            }
            return res.status(200).json(deletedPermission);
        } catch (error) {
            throw new HttpException(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
