import { Module } from '@nestjs/common';
import { MicroserviceConnectionModule } from './../libs/sco-nestjs-utilities/src/microservice-connection/microservice-connection.module';
import { SftpModule } from './../libs/sco-nestjs-utilities/src/sftp/sftp.module';
import { PaginationModule } from './../libs/sco-nestjs-utilities/src/pagination/pagination.module';
import { EmailerModule } from './../libs/sco-nestjs-utilities/src/emailer/emailer.module';
import { LoggerModule } from './../libs/sco-nestjs-utilities/src/logger/logger.module';
import { WebsocketModule } from './../libs/sco-nestjs-utilities/src/websocket/websocket.module';
import { MongoDbModule } from './../libs/sco-nestjs-utilities/src/mongo-db/mongo-db.module';
import { ExcelModule } from './../libs/sco-nestjs-utilities/src/excel/excel.module';
import { UsersModule } from './../libs/sco-nestjs-utilities/src/users/users.module';
import { SharedModule } from './../libs/sco-nestjs-utilities/src/shared/shared.module';
import { AuthModule } from './../libs/sco-nestjs-utilities/src/auth/auth.module';
import { PermissionsModule } from './../libs/sco-nestjs-utilities/src/permissions/permissions.module';
import { RolesModule } from './../libs/sco-nestjs-utilities/src/roles/roles.module';
import { PopulateModule } from './../libs/sco-nestjs-utilities/src/populate/populate.module';

export const JWT_CONTROLLER: boolean = false;

@Module({
  imports: [
    LoggerModule,
    PaginationModule,
    SharedModule,
    MongoDbModule.register({
      ip: 'localhost',
      port: 27017,
      database: 'sco-nestjs-utilities'
    }),
    WebsocketModule.register({
      port: 8070,
      origin: 'http://localhost, http://localhost:8070',
    }),
    MicroserviceConnectionModule.register({
      enabled: false,
      host: '0.0.0.0',
      port: 3006,
    }),
    AuthModule.register({
      secret: 'qu3Ric0Est4ElCachop025!',
      signOptions: {
        expiresIn: '365d'
      },
      algorithm: 'HS256',
      newUserActived: false,
    }),
    EmailerModule.register({
      jwtController: JWT_CONTROLLER,
      sending_Email_Address: 'youremail@email.com',
      sending_Email_Password: 'yourPasswordEmail',
      service: 'gmail' || 'hotmail',
    }),
    ExcelModule.register({
      jwtController: JWT_CONTROLLER,
    }),
    SftpModule.register({
      jwtController: JWT_CONTROLLER,
      host: 'X.X.X.X',
      port: 22,
      username: 'user',
      password: 'userPassword'
    }),
    PermissionsModule.register({
      jwtController: JWT_CONTROLLER,
    }),
    RolesModule.register({
      jwtController: JWT_CONTROLLER,
    }),
    UsersModule.register({
      jwtController: JWT_CONTROLLER,
      newUserActived: true,
    }),

    /* Always Last Module On Load */
    PopulateModule.register({
      populate: true,
    })
  ],
  controllers: [

  ],
  providers: [

  ],
})

export class AppModule {}
