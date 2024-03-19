import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthConfig } from './config/auth.config';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthStrategy } from './strategies/auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { RolesModule } from '../roles/roles.module';

interface AuthConfigFactory {
  createAuthConfig(): Promise<AuthConfig> | AuthConfig;
}

export interface AuthAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<AuthConfigFactory>;
  useClass?: Type<AuthConfigFactory>;
  useFactory?: (...args: any[]) => Promise<AuthConfig> | AuthConfig;
}

@Module({})
export class AuthModule {
  
  static register(options: AuthConfig): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [
        AuthRepository,
        AuthService, 
        AuthStrategy,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: options.secret,
          signOptions: options.signOptions,
        }),
        SharedModule,
        UsersModule,
        RolesModule,
      ],
      exports: [AuthRepository, AuthService, AuthStrategy],
      global: true,
    };
  }

  public static registerAsync(options: AuthAsyncConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          useFactory: options.useFactory,
          inject: options.inject || [],
        }),
        SharedModule,
        UsersModule,
        RolesModule,
      ],
      controllers: [AuthController],
      providers: [
        AuthRepository,
        AuthService,
        AuthStrategy,
        ...this.createConfigProviders(options),
      ],
      exports: [AuthRepository, AuthService, AuthStrategy],
      global: true
    };
  }

  private static createConfigProviders(options: AuthAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: AuthConfigFactory) => 
          await optionsFactory.createAuthConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}
