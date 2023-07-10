import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Hotel Aggregator APIs')
    .setDescription('List of Hotel Aggregator APIs with details')
    .setVersion('1.0')
    .addTag('hotels')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    name: 'AUTH_MICROSERVICE',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });
  app.useGlobalPipes(new ValidationPipe())
  await app.startAllMicroservices();
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
