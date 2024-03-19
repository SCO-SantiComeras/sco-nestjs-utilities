import { MicroserviceConnectionService } from './microservice-connection.service';
import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { MicroserviceConnectionConfig } from './microservice-connection-config';

interface MicroServiceConfigFactory {
    createMicroserviceConnectionConfig(): Promise<MicroserviceConnectionConfig> | MicroserviceConnectionConfig;
}
  
export interface MicroServiceAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useExisting?: Type<MicroServiceConfigFactory>;
    useClass?: Type<MicroServiceConfigFactory>;
    useFactory?: (...args: any[]) => Promise<MicroserviceConnectionConfig> | MicroserviceConnectionConfig;
}

@Module({
    providers: [MicroserviceConnectionService],
    exports: [MicroserviceConnectionService]
})
export class MicroserviceConnectionModule {

    static register(options: MicroserviceConnectionConfig): DynamicModule {
        return {
            module: MicroserviceConnectionModule,
            providers: [
                {
                    provide: 'CONFIG_OPTIONS',
                    useValue: options,
                },
                MicroserviceConnectionService,
            ],
            exports: [MicroserviceConnectionService],
            global: true
        };
    }

    public static registerAsync(options: MicroServiceAsyncConfig): DynamicModule {
        return {
          module: MicroserviceConnectionModule,
          providers: [
            {
                provide: 'CONFIG_OPTIONS',
                useValue: options,
            },
            MicroserviceConnectionService,
          ],
          exports: [MicroserviceConnectionService],
          global: true
        };
      }
    
      private static createConfigProviders(options: MicroServiceAsyncConfig): Provider[] {
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
            useFactory: async (optionsFactory: MicroServiceConfigFactory) => 
              await optionsFactory.createMicroserviceConnectionConfig(),
            inject: [options.useExisting || options.useClass],
          }
        ];
      }
}
