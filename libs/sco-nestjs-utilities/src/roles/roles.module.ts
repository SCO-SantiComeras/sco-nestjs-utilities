import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongoDbService } from '../mongo-db/mongo-db.service';
import { MONGODB_CONSTANTS } from '../mongo-db/mongo-db.constants';
import { SharedModule } from '../shared/shared.module';
import { RolesConfig } from './config/roles.config';
import { RolesControllerJwt } from './roles.controller.jwt';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';
import { IRole } from './interface/irole.interface';
import { roleSchema } from './schema/role.schema';
import { PermissionsModule } from '../permissions/permissions.module';

interface RolesConfigFactory {
  createRolesConfig(): Promise<RolesConfig> | RolesConfig;
}

export interface RolesAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<RolesConfigFactory>;
  useClass?: Type<RolesConfigFactory>;
  useFactory?: (...args: any[]) => Promise<RolesConfig> | RolesConfig;
}

@Module({
})
export class RolesModule {

  static register(options: RolesConfig): DynamicModule {
    return {
      module: RolesModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
        PermissionsModule,
      ],
      controllers: [options.jwtController ? RolesControllerJwt : RolesController],
      providers: [
        RolesRepository,
        RolesService,
        {
          provide: 'MODEL',
          useFactory: (db: MongoDbService) =>
            db.getConnection().model<IRole>(MONGODB_CONSTANTS.ROLES.MODEL, roleSchema, MONGODB_CONSTANTS.ROLES.TABLE),
          inject: [MongoDbService],
        },
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [RolesRepository, RolesService],
      global: true,
    };
  }

  public static registerAsync(options: RolesAsyncConfig, jwtController: boolean = false): DynamicModule {
    return {
      module: RolesModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
        PermissionsModule,
      ],
      controllers: [jwtController ? RolesControllerJwt : RolesController],
      providers: [
        RolesRepository,
        RolesService,
        {
          provide: 'MODEL',
          useFactory: (db: MongoDbService) =>
            db.getConnection().model<IRole>(MONGODB_CONSTANTS.ROLES.MODEL, roleSchema, MONGODB_CONSTANTS.ROLES.TABLE),
          inject: [MongoDbService],
        },
        ...this.createConfigProviders(options),
      ],
      exports: [RolesRepository, RolesService],
      global: true
    };
  }

  private static createConfigProviders(options: RolesAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: RolesConfigFactory) => 
          await optionsFactory.createRolesConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}
