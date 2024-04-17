import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, ServerOptions } from 'socket.io';
import { Socket } from 'dgram';
import { WebsocketConfig } from './config/websocket-config';
import { WEBSOCKET_EVENTS } from './constants/websocket.events';

@Injectable()
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnApplicationBootstrap {
  
  constructor(@Inject('CONFIG_OPTIONS') private options: WebsocketConfig) {}

  @WebSocketServer() server: Server;

  async afterInit(server: Server, options?: ServerOptions) {
    return;
  }

  onApplicationBootstrap() {
    console.log(`[WebsocketGateway] Websocket started on port: ${this.options.port}`);
   }

  handleDisconnect(client: Socket) {
    console.log('[WebsocketGateway] Client disconnected: ', client['handshake'].headers.origin);
  }

  async handleConnection(client: Socket) {
    console.log('[WebsocketGateway] Client connected: ', client['handshake'].headers.origin);
  }

  async notifyWebsockets(wsEvent: string, verbose: boolean = false): Promise<boolean> {
    // SI las constantes del backend donde se consume la librería son distintas a las del objeto de la librería dara false
    // Si creas un nuevo modulo que emite un nuevo evento de websocket desde el backend donde consumes la librería no se podra emitir el evento
    // Necesita fixeo
    /* if (!this.validateWebsocketEvent(wsEvent)) {
      console.log(`[notifyWebsockets] Event '${wsEvent}' is not a valid event`);
      return false;
    } */

    if (!this.sendWebsocketNotification(wsEvent)) {
      console.log(`[notifyWebsockets] Event '${wsEvent}' unnable to send notification`);
      return false;
    }

    if (verbose) console.log(`[notifyWebsockets] Event '${wsEvent}' notification sended`);
    return true;
  }

  private sendWebsocketNotification(wsEvent: string): boolean {
    let notificationSended: boolean = false;
    try {
      this.server.emit(wsEvent, true);
      notificationSended = true;
    } catch (err) {
      console.error(`[sendWebsocketNotification] Error: ${JSON.stringify(err)}`);
    } finally {
      return notificationSended;
    }
  }

  private validateWebsocketEvent(wsEvent: string): boolean {
    let validEvent: boolean = false;

    for (const event of Object.values(WEBSOCKET_EVENTS)) {
      if (event == wsEvent) {
        validEvent = true;
        break;
      }
    }

    return validEvent;
  }
}
