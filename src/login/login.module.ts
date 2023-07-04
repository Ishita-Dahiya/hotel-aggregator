import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
//import { UserService } from '../user/user.service';
import { UserSchema } from './login.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';


const uri = "mongodb+srv://ishita11089:khWhMe8H1GOsHjCz@cluster0.ijojrmk.mongodb.net/Hotel-Aggregator?retryWrites=true&w=majority";


@Module({
  imports: [
    MongooseModule.forRoot(uri), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'LOGIN_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
