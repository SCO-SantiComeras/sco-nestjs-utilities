import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MicroserviceConnectionConfig } from './microservice-connection-config';
import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';

@Injectable()
export class MicroserviceConnectionService implements OnApplicationBootstrap {

  private _client: ClientProxy;

  constructor(@Inject('CONFIG_OPTIONS') private options: MicroserviceConnectionConfig) {
    this._client = this.getClient();
  }

  async onApplicationBootstrap() {
    if (this.options.enabled) {
      this.microserviceConnection();
    }
  }

  async microserviceConnection(): Promise<boolean> {
    let microserviceConnected: boolean = false;

    try {
      await this._client.connect();
      microserviceConnected = true;
      console.log(`[microserviceConnection] Micro service connection successfully done`);
    } catch (error) {
      const errorText = error.message;

      if (errorText.includes('ECONNREFUSED')) {
        console.log(`[microserviceConnection] ${HTTP_ERROR_CONSTANTS.MICRO_SERVICE_CONNECTION.MICRO_SERVICE_CONNECTION_CONNECTION_REFUSED}`);
      }

      if (errorText.includes('EADDRINUSE')) {
        console.log(`[microserviceConnection] ${HTTP_ERROR_CONSTANTS.MICRO_SERVICE_CONNECTION.MICRO_SERVICE_CONNECTION_PORT_IN_USE}`);
      }
      
      if (!errorText.includes('ECONNREFUSED') && !errorText.includes('EADDRINUSE')) {
        console.log(`[microserviceConnection] Error: ${JSON.stringify(error)}`);
      }
    } finally {
      return microserviceConnected;
    }
  }

  private getClient(): ClientProxy {
    try {
      return ClientProxyFactory.create(
        {
            transport: Transport.TCP,
            options: {
              host: this.options.host,
              port: this.options.port,
            },
        },
      );
    } catch (error) {
      console.log(`[getClient] Error: ${JSON.stringify(error)}`);
    }
  }
}