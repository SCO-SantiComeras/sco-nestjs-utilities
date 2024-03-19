import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { PopulateService } from "./populate.service";
import { PermissionsModule } from "../permissions/permissions.module";
import { RolesModule } from "../roles/roles.module";
import { UsersModule } from "../users/users.module";
import { PopulateConfig } from "./populate.config";

interface PopulateConfigFactory {
  createPopulateConfig(): Promise<PopulateConfig> | PopulateConfig;
}

export interface PopulateAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<PopulateConfigFactory>;
  useClass?: Type<PopulateConfigFactory>;
  useFactory?: (...args: any[]) => Promise<PopulateConfig> | PopulateConfig;
}

@Module({
})
export class PopulateModule { 

  static register(options: PopulateConfig): DynamicModule {
    return {
      module: PopulateModule,
      imports: [
        PermissionsModule.register({}),
        RolesModule.register({}),
        UsersModule.register({}),
      ],
      providers: [
        PopulateService,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [
        PopulateService,
      ],
      global: true,
    };
  }

  public static registerAsync(options: PopulateAsyncConfig): DynamicModule {
    return {
      module: PopulateModule,
      imports: [
        PermissionsModule.register({}),
        RolesModule.register({}),
        UsersModule.register({}),
      ],
      providers: [
        PopulateService,
        ...this.createConfigProviders(options),
      ],
      exports: [
        PopulateService,
      ],
      global: true
    };
  }

  private static createConfigProviders(options: PopulateAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: PopulateConfigFactory) => 
          await optionsFactory.createPopulateConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }

}
