import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ExcelController } from "./excel.controller";
import { ExcelRepository } from "./excel.repository";
import { ExcelService } from "./excel.service";
import { ExcelControllerJwt } from "./excel.controller.jwt";
import { ExcelConfig } from "./config/excel-config";

interface ExcelConfigFactory {
  createExcelConfig(): Promise<ExcelConfig> | ExcelConfig;
}

export interface ExcelAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<ExcelConfigFactory>;
  useClass?: Type<ExcelConfigFactory>;
  useFactory?: (...args: any[]) => Promise<ExcelConfig> | ExcelConfig;
}

@Module({
})
export class ExcelModule {
  
  static register(options: ExcelConfig): DynamicModule {
    return {
      module: ExcelModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [options.jwtController ? ExcelControllerJwt : ExcelController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ExcelRepository,
        ExcelService,
      ],
      exports: [ExcelRepository, ExcelService],
      global: true,
    };
  }

  public static registerAsync(options: ExcelAsyncConfig, jwtController: boolean = false): DynamicModule {
    return {
      module: ExcelModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [jwtController ? ExcelControllerJwt : ExcelController],
      providers: [
        ExcelRepository,
        ExcelService,
        ...this.createConfigProviders(options),
      ],
      exports: [ExcelRepository, ExcelService],
      global: true
    };
  }

  private static createConfigProviders(options: ExcelAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: ExcelConfigFactory) => 
          await optionsFactory.createExcelConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}
