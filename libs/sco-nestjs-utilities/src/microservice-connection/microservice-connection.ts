import { ClientOptions, Transport } from "@nestjs/microservices";

export class MicroserviceToBackend {
    client: ClientOptions = {
        transport: Transport.TCP,
        options: {
          host: "0.0.0.0",
          port: 3032,
        },
    };

    constructor(host?: string, port?: number) {
        this.client.options = {
            host: !host ? '0.0.0.0' : host,
            port: port == undefined ? 3032 : port,
        };
    }
};
  