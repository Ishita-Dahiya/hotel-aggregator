import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { HotelResolver } from './hotel.resolver';
import { MongooseModule } from '@nestjs/mongoose';
//import { HotelController } from "./hotel.controller";
import { HotelService } from "./hotel.service";
import { HotelSchema } from './hotel.schema';
import {AppModule} from '../../../billing-microservice/src/app.module';

@Module({
    imports: [AppModule,MongooseModule.forFeature([{ name: 'Hotel', schema: HotelSchema }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'hotel.gql',
      playground: true,
      context: ({ req }) => ({ req })
    })],
    //controllers: [HotelController],
    providers: [HotelService, HotelResolver],
  })

export class HotelModule {}
