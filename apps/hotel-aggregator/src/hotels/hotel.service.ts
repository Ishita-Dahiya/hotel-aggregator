//import { Neo4jService } from "@dbc-tech/nest-neo4j";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from './hotel.interface';
import { CreateHotelDto } from "./dtos/create-hotel.dto";
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';


@Injectable()
export class HotelService {
  private readonly authClient: ClientProxy;

  constructor(@InjectModel('Hotel') private readonly hotelModel: Model<Hotel>) {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  }


      async getAllHotels(): Promise<Hotel[]> {
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
    
      async addHotel(hotelModel: CreateHotelDto): Promise<Hotel> {
        const hotelId = new mongoose.Types.ObjectId();
        const finalData = {
          _id: hotelId,
          ...hotelModel
        }
        const createdMyModel = new this.hotelModel(finalData);
        try {
          return createdMyModel.save();
        } catch (error) {
          throw new BadRequestException(
            'Some error occurred',
            { cause: new Error(), description: 'Some error occurred.Please Try again.' })
        }
      }

      async updateHotel(id: string, hotelModel: CreateHotelDto): Promise<any> {
        return this.hotelModel.updateOne({ _id: id }, hotelModel).exec();
      }
    

      async deleteHotel(id: string): Promise<any> {
        return this.hotelModel.deleteOne({ _id: id }).exec();
      }
      
      async login(credentials: { email: string, password: string }) {
        //return this.authClient.send('validate_user', credentials).toPromise();
        return this.authClient.send({ cmd: 'validate_user' }, credentials).toPromise();
      }
    
}


