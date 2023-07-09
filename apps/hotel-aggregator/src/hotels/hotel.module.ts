import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from "./hotel.controller";
import { HotelService } from "./hotel.service";
import { HotelSchema } from './hotel.schema';

//const uri = "mongodb+srv://ishita11089:khWhMe8H1GOsHjCz@cluster0.ijojrmk.mongodb.net/Hotel-Aggregator?retryWrites=true&w=majority";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Hotel', schema: HotelSchema }])],
    controllers: [HotelController],
    providers: [HotelService],
  })
  

export class HotelModule {

}
