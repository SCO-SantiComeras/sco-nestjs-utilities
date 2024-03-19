import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongoDbService } from '../mongo-db/mongo-db.service';
import { IUser } from './interface/iuser.interface';
import { userSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { MONGODB_CONSTANTS } from '../mongo-db/mongo-db.constants';
import { SharedModule } from '../shared/shared.module';
import { UsersConfig } from './config/users.config';
import { UsersService } from './users.service';
import { UsersControllerJwt } from './users.controller.jwt';
import { RolesModule } from '../roles/roles.module';

interface UsersConfigFactory {
  createUsersConfig(): Promise<UsersConfig> | UsersConfig;
}

export interface UsersAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<UsersConfigFactory>;
  useClass?: Type<UsersConfigFactory>;
  useFactory?: (...args: any[]) => Promise<UsersConfig> | UsersConfig;
}

@Module({
})
export class UsersModule {

  static register(options: UsersConfig): DynamicModule {
    return {
      module: UsersModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
        RolesModule,
      ],
      controllers: [options.jwtController ? UsersControllerJwt : UsersController],
      providers: [
        UsersRepository,
        UsersService,
        {
          provide: 'MODEL',
          useFactory: (db: MongoDbService) =>
            db.getConnection().model<IUser>(MONGODB_CONSTANTS.USERS.MODEL, userSchema, MONGODB_CONSTANTS.USERS.TABLE),
          inject: [MongoDbService],
        },
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [UsersRepository, UsersService],
      global: true,
    };
  }

  public static registerAsync(options: UsersAsyncConfig, jwtController: boolean = false): DynamicModule {
    return {
      module: UsersModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
        RolesModule,
      ],
      controllers: [jwtController ? UsersControllerJwt : UsersController],
      providers: [
        UsersRepository,
        UsersService,
        {
          provide: 'MODEL',
          useFactory: (db: MongoDbService) =>
            db.getConnection().model<IUser>(MONGODB_CONSTANTS.USERS.MODEL, userSchema, MONGODB_CONSTANTS.USERS.TABLE),
          inject: [MongoDbService],
        },
        ...this.createConfigProviders(options),
      ],
      exports: [UsersRepository, UsersService],
      global: true
    };
  }

  private static createConfigProviders(options: UsersAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: UsersConfigFactory) => 
          await optionsFactory.createUsersConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}
