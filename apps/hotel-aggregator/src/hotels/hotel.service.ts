import { BadRequestException, Injectable } from "@nestjs/common";
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from './hotel.schema';
import { CreateHotelDto } from "./dtos/create-hotel.dto";
import { UpdateHotelDto } from "./dtos/update-hotel.dto";
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';


@Injectable()
export class HotelService {
  private readonly authClient: ClientProxy;
  private readonly billingClient: ClientProxy;

  constructor(@InjectModel('Hotel') private readonly hotelModel: Model<Hotel>) {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });

    this.billingClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8000,
      },
    });
  }


  async getAllHotels(): Promise<Hotel[]> {
    console.log('here22')
    return this.hotelModel.find().exec();
  }

  async getLocations(): Promise<string[]> {
    return await this.hotelModel.distinct('location').exec();
  }


  async getHotelByLocation(location: string): Promise<Hotel> {
    return this.hotelModel.findOne({ location: { $regex: new RegExp(`^${location}$`), $options: 'i' }, }).exec();
  }

  async getHotelByName(hotelTitle: string): Promise<Hotel> {
    return this.hotelModel.findOne({ hotelTitle: { $regex: new RegExp(`.*${hotelTitle}.*`), $options: 'i' }, }).exec();
  }

  async addHotel(hotelModel: CreateHotelDto): Promise<Boolean> {
    const hotelId = new mongoose.Types.ObjectId();
    const finalData = {
      _id: hotelId,
      ...hotelModel
    }
    const createdMyModel = new this.hotelModel(finalData);
    try {
      createdMyModel.save()
      return true;
    } catch (error) {
      throw new BadRequestException(
        'Some error occurred',
        { cause: new Error(), description: 'Some error occurred.Please Try again.' })
    }
  }

  async updateHotel(id: string, hotelModel: UpdateHotelDto): Promise<Hotel> {
    //return this.hotelModel.updateOne({ _id: id }, hotelModel).exec();
    return this.hotelModel.findByIdAndUpdate(id, hotelModel, { new: true }).exec();
  }


  async deleteHotel(id: string): Promise<boolean> {
    const result = await this.hotelModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async login(credentials: { email: string, password: string }) {
    return this.authClient.send({ cmd: 'validate_user' }, credentials).toPromise();
  }

  async billing() {
    const result = await this.billingClient.send({ cmd: 'sayHello' }, 'Service A request').toPromise();
    if (result) {
      return result.message;
    }
    return '';
  }

}


