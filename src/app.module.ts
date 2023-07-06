import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {HotelModule} from './hotels/hotel.module';
import { AppService } from './app.service';
import { LoginModule } from './login-microservice/login.module';


//MongooseModule.forRoot('mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority'

@Module({
  imports: [
    HotelModule,
    LoginModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
