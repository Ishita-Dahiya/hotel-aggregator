import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthGuard } from './login.strategy';
import { UserSchema } from './login.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';



const uri = "mongodb+srv://ishita11089:khWhMe8H1GOsHjCz@cluster0.ijojrmk.mongodb.net/Hotel-Aggregator?retryWrites=true&w=majority";


@Module({
  imports: [
    MongooseModule.forRoot(uri), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [LoginController],
  providers: [LoginService, AuthGuard],
})
export class LoginModule {}
