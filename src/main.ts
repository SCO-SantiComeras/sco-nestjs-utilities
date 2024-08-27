import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { LoggerService } from './../libs/sco-nestjs-utilities/src/logger/logger.service';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WebsocketAdapter } from './../libs/sco-nestjs-utilities/src/websocket/adapter/websocket-adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, 
    { 
      logger: new LoggerService(),
      httpsOptions: undefined
    }
  );

  const configService = app.get<ConfigService>(ConfigService);

  /* const configService = app.get<ConfigService>(ConfigService); */

  let swaggeer: boolean = false;
  const swaggerRoute: string = 'api';
  const swaggerDocument = new DocumentBuilder()
    .setTitle('SCO Nestjs Utilities')
    .setDescription('Documentación y swagger sobre la librería SCO Nestjs Utilities')
    .setVersion('1.0')
    .addTag('SCO')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  SwaggerModule.setup(swaggerRoute, app, SwaggerModule.createDocument(app, swaggerDocument));
  swaggeer = true;

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = Object.values(validationErrors[0].constraints).join(',');
        const splitErrors: string[] = errors.split(',');
        throw new HttpException(splitErrors[splitErrors.length-1], HttpStatus.BAD_REQUEST);
      },
    }),
  );

  /* const envOrigin: string = configService.get('websocket.origin');
  let origin: string[] = [];
  if (envOrigin && envOrigin.length > 0) {
    origin = [envOrigin];

    if (envOrigin.includes(',')) {
      origin = envOrigin.split(',');
    }
  }
  
  app.enableCors({
    origin: origin,
    credentials: true,
  }); */

  app.useWebSocketAdapter(new WebsocketAdapter(app, configService));

  await app.listen(3005);
  if (swaggeer) console.log(`[bootstrap] Swagger started in url 'http://${'localhost'}:${3005}/${swaggerRoute}'`);
  console.log(`[bootstrap] App started in 'http://${'localhost'}:${3005}'`);
}
bootstrap();