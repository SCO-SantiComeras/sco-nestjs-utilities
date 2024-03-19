import { INestApplicationContext, Inject } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { WebsocketConfig } from '../config/websocket-config';

export class WebsocketAdapter extends IoAdapter {

    constructor(
        private readonly app: INestApplicationContext,
        @Inject('CONFIG_OPTIONS') private options: WebsocketConfig,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const envOrigin: string = this.options.origin;
        const formatOrigin: string[] = this.formatOrigin(envOrigin);
        
        port = this.options.port || 8080;
        options.cors = { 
            origin : formatOrigin,
            credentials: true,
        }; 
       
        return super.createIOServer(port, options);
    }

    private formatOrigin(envOrigin: string): string[] {
        let formatOrigin: string[] = [];

        if (envOrigin && envOrigin.length > 0) {
            formatOrigin = [envOrigin];

            if (envOrigin.includes(',')) {
                formatOrigin = envOrigin.split(',');
            }
        }

        return formatOrigin;
    }
}