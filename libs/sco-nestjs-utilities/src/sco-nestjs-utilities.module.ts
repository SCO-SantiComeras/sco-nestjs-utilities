import { SftpModule } from './sftp/sftp.module';
import { PaginationModule } from './pagination/pagination.module';
import { EmailerModule } from './emailer/emailer.module';
import { LoggerModule } from './logger/logger.module';
import { WebsocketModule } from './websocket/websocket.module';
import { Module } from '@nestjs/common';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { MicroserviceConnectionModule } from './microservice-connection/microservice-connection.module';
import { ExcelModule } from './excel/excel.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { PopulateModule } from './populate/populate.module';

@Module({
  imports: [
    LoggerModule,
    SharedModule,
    PaginationModule,
    MongoDbModule,
    AuthModule,
    WebsocketModule,
    MicroserviceConnectionModule,
    EmailerModule,
    ExcelModule,
    SftpModule,
    PermissionsModule,
    RolesModule,
    UsersModule,

    PopulateModule,
  ],
  providers: [

  ],
  exports: [
    LoggerModule,
    SharedModule,
    PaginationModule,
    MongoDbModule,
    AuthModule,
    WebsocketModule,
    MicroserviceConnectionModule,
    EmailerModule,
    ExcelModule,
    SftpModule,
    PermissionsModule,
    RolesModule,
    UsersModule,

    PopulateModule,
  ],
})

export class ScoNestjsUtilitiesModule {}
