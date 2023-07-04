import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    name: 'LOGIN_MICROSERVICE',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });
  app.useGlobalPipes(new ValidationPipe())
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
