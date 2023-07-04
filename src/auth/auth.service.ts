import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });
  }

  async login(credentials: { email: string, password: string }) {
    console.log('hello')
    return this.client.send('LOGIN_MICROSERVICE', credentials).toPromise();
    //return this.client.send({ cmd: 'login' }, credentials).toPromise();
  }
}

