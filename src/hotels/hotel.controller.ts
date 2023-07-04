import { Controller, Post, Get, Body, Param, HttpCode,
   HttpException, HttpStatus, BadRequestException, Delete, Put } from "@nestjs/common";
import { CreateHotelDto } from "./dtos/create-hotel.dto";
import { HotelService } from "./hotel.service";
import { Hotel } from './hotel.interface';


@Controller('hotels')
export class HotelController {

    constructor(private readonly hotelService: HotelService) {
    }

  @Get()
  async getAllHotels(): Promise<Hotel[]> {
    try {
      return this.hotelService.getAllHotels();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
  

  @Get('/locations')
  async getLocations(): Promise<string[]> {
    try {
      return this.hotelService.getLocations();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

      @Get(':loc')
  async getHotelByLocation(@Param('loc') location: string): Promise<Hotel> {
    try {
      return this.hotelService.getHotelByLocation(location);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  @Get('/search/:title')
  async getHotelByName(@Param('title') name: string): Promise<Hotel> {
    try {
      return this.hotelService.getHotelByName(name);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

      @Post('/add')
      @HttpCode(204)
      async addHotel(@Body() hotel: CreateHotelDto): Promise<Hotel> {
        try {
          return this.hotelService.addHotel(hotel);
        } catch (error) {
          throw new BadRequestException(
            'Something bad happened',
            { cause: new Error(), description: 'Some error description' })
        }
      }

      @Put(':id')
  async update(@Param('id') id: string, @Body() hotel: CreateHotelDto): Promise<any> {
    return this.hotelService.updateHotel(id, hotel);
  }


      @Delete(':id')
  async deleteHotel(@Param('id') id: string): Promise<any> {
    return this.hotelService.deleteHotel(id);
  }

}
