import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SftpConfig } from "./config/sftp-config";
import { SftpRepository } from "./sftp.repository";
import { SftpController } from "./sftp.controller";
import { SftpService } from "./sftp.service";
import { SftpControllerJwt } from "./sftp.controller.jwt";

interface SftpConfigFactory {
  createSftpConfig(): Promise<SftpConfig> | SftpConfig;
}

export interface SftpAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<SftpConfigFactory>;
  useClass?: Type<SftpConfigFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<SftpConfig> | SftpConfig;
}

@Module({
})
export class SftpModule {
  static register(options: SftpConfig): DynamicModule {
    return {
      module: SftpModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [options.jwtController ? SftpControllerJwt : SftpController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        SftpService,
        SftpRepository,
      ],
      exports: [SftpRepository, SftpService],
    };
  }

  public static registerAsync(options: SftpAsyncConfig, jwtController: boolean = false): DynamicModule {
    return {
      module: SftpModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [jwtController ? SftpControllerJwt : SftpController],
      providers: [
        SftpRepository,
        SftpService,
        ...this.createConfigProviders(options),
      ],
      exports: [SftpRepository, SftpService],
      global: true
    };
  }

  private static createConfigProviders(options: SftpAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: SftpConfigFactory) => await optionsFactory.createSftpConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}
