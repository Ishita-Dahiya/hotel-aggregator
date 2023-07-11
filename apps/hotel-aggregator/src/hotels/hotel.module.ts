import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from "./hotel.controller";
import { HotelService } from "./hotel.service";
import { HotelSchema } from './hotel.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Hotel', schema: HotelSchema }])],
    controllers: [HotelController],
    providers: [HotelService],
  })

export class HotelModule {}
