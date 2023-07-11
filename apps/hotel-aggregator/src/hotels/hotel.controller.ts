import {
  Controller, Post, Get, Body, Param, HttpCode,HttpException, HttpStatus, Delete, Put,
   UseGuards, Res, UnauthorizedException, NotFoundException, SetMetadata, Session
} from "@nestjs/common";
import { CreateHotelDto } from "./dtos/create-hotel.dto";
import { HotelService } from "./hotel.service";
import { Hotel } from './hotel.interface';
import { AuthGuard } from '../../../login-microservice/login.guard';
import { RolesGuard } from '../../../login-microservice/role.guard';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";



@ApiTags('hotels')
@Controller('hotels')
export class HotelController {

  constructor(private readonly hotelService: HotelService) {
  }

  @Get()
  @ApiResponse({ status: 200, description: 'It will return list of all hotels' })
  @ApiOperation({ summary: 'Get list of all hotels' })
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
      const hotelNames = await this.hotelService.getHotelByLocation(location);
      if (hotelNames) {
        return hotelNames;
      }
      throw new NotFoundException();
    } catch (error) {
      throw new HttpException({
        status: error.message === 'Not Found' ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN,
        error: error.message === 'Not Found' ? 'No record found' : 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
      });
    }
  }

  @Get('/search/:title')
  async getHotelByName(@Param('title') name: string): Promise<Hotel> {
    try {
      const hotelName = await this.hotelService.getHotelByName(name);
      if (hotelName) {
        return hotelName;
      }
      throw new NotFoundException();
    } catch (error) {
      throw new HttpException({
        status: error.message === 'Not Found' ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN,
        error: error.message === 'Not Found' ? 'No record found' : 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
      });
    }
  }

  @Post('/add')
  @ApiResponse({ status: 201, description: 'The hotel has been successfully created.' })
  @ApiOperation({ summary: 'Create a new hotel' })
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['dealer', 'admin'])
  async addHotel(@Body() hotel: CreateHotelDto, @Session() session: Record<string, any>): Promise<Hotel> {
    try {
      const user = session.user;
      if (!user) {
        throw new UnauthorizedException('Session has been expired. User need to login again!');
      }
      return this.hotelService.addHotel(hotel);
    } catch (error) {
      if (error.response.error !== 'Unauthorized') {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'This is an error while fetching data',
        }, HttpStatus.FORBIDDEN, {
          cause: error
        });
      } else {
        throw new UnauthorizedException('Session has been expired. User need to login again!');
      }
    }
  }

  @Put(':id')
  @HttpCode(201)
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['dealer', 'admin'])
  async update(@Param('id') id: string, @Body() hotel: CreateHotelDto, @Session() session: Record<string, any>): Promise<any> {
    const user = session.user;
    if (!user) {
      throw new UnauthorizedException('Session has been expired. User need to login again!');
    }
    return this.hotelService.updateHotel(id, hotel);
  }


  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['dealer', 'admin'])
  async deleteHotel(@Param('id') id: string, @Session() session: Record<string, any>): Promise<any> {
    const user = session.user;
    if (!user) {
      throw new UnauthorizedException('Session has been expired. User need to login again!');
    }
    return this.hotelService.deleteHotel(id);
  }

  @Post('login')
  async login(@Res() res, @Body() credentials: { email: string, password: string }, @Session() session: Record<string, any>) {
    const result = await this.hotelService.login(credentials);
    if (result) {
      session.user = result.user;
      return res.status(HttpStatus.OK).json({ token: result.token, user: result.user })
    }
    else {
      throw new UnauthorizedException('User is not registered with the App');
    }
  }
}

