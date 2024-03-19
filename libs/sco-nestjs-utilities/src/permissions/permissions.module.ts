import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongoDbService } from '../mongo-db/mongo-db.service';
import { MONGODB_CONSTANTS } from '../mongo-db/mongo-db.constants';
import { SharedModule } from '../shared/shared.module';
import { PermissionsConfig } from './config/permissions.config';
import { PermissionsControllerJwt } from './permissions.controller.jwt';
import { PermissionsController } from './permissions.controller';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';
import { IPermission } from './interface/ipermission.interface';
import { permissionSchema } from './schema/permission.schema';

interface PermissionsConfigFactory {
  createPermissionsConfig(): Promise<PermissionsConfig> | PermissionsConfig;
}

export interface PermissionsAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<PermissionsConfigFactory>;
  useClass?: Type<PermissionsConfigFactory>;
  useFactory?: (...args: any[]) => Promise<PermissionsConfig> | PermissionsConfig;
}

@Module({
})
export class PermissionsModule {

  static register(options: PermissionsConfig): DynamicModule {
    return {
      module: PermissionsModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
      ],
      controllers: [options.jwtController ? PermissionsControllerJwt : PermissionsController],
      providers: [
        PermissionsRepository,
        PermissionsService,
        {
          provide: 'MODEL',
          useFactory: (db: MongoDbService) =>
            db.getConnection().model<IPermission>(MONGODB_CONSTANTS.PERMISSIONS.MODEL, permissionSchema, MONGODB_CONSTANTS.PERMISSIONS.TABLE),
          inject: [MongoDbService],
        },
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [PermissionsRepository, PermissionsService],
      global: true,
    };
  }

  public static registerAsync(options: PermissionsAsyncConfig, jwtController: boolean = false): DynamicModule {
    return {
      module: PermissionsModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
      ],
      controllers: [jwtController ? PermissionsControllerJwt : PermissionsController],
      providers: [
        PermissionsRepository,
        PermissionsService,
        {
          provide: 'MODEL',
          useFactory: (db: MongoDbService) =>
            db.getConnection().model<IPermission>(MONGODB_CONSTANTS.PERMISSIONS.MODEL, permissionSchema, MONGODB_CONSTANTS.PERMISSIONS.TABLE),
          inject: [MongoDbService],
        },
        ...this.createConfigProviders(options),
      ],
      exports: [PermissionsRepository, PermissionsService],
      global: true
    };
  }

  private static createConfigProviders(options: PermissionsAsyncConfig): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        }
      ]
    }

    return [
      {
        provide: 'CONFIG_OPTIONS',
        useFactory: async (optionsFactory: PermissionsConfigFactory) => 
          await optionsFactory.createPermissionsConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}
