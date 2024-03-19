import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { EmailerConfig } from './config/emailer-config';
import { EmailerRepository } from './emailer.repository';
import { EmailerController } from './emailer.controller';
import { EmailerService } from './emailer.service';
import { EmailerControllerJwt } from './emailer.controller.jwt';
import { PassportModule } from '@nestjs/passport';

interface EmailerConfigFactory {
  createEmailerConfig(): Promise<EmailerConfig> | EmailerConfig;
}

export interface EmailerAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<EmailerConfigFactory>;
  useClass?: Type<EmailerConfigFactory>;
  useFactory?: (...args: any[]) => Promise<EmailerConfig> | EmailerConfig;
}

@Module({
})
export class EmailerModule {
  static register(options: EmailerConfig): DynamicModule {
    return {
      module: EmailerModule,
      imports:[
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [options.jwtController ? EmailerControllerJwt : EmailerController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        EmailerRepository,
        EmailerService,
      ],
      exports: [EmailerRepository, EmailerService],
      global: true,
    };
  }

  public static registerAsync(options: EmailerAsyncConfig, jwtController: boolean = false): DynamicModule {
    return {
      module: EmailerModule,
      imports:[
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [jwtController ? EmailerControllerJwt : EmailerController],
      providers: [
        EmailerRepository,
        EmailerService,
        ...this.createConfigProviders(options),
      ],
      exports: [EmailerRepository, EmailerService],
      global: true
    };
  }

  private static createConfigProviders(options: EmailerAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: EmailerConfigFactory) => 
          await optionsFactory.createEmailerConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}