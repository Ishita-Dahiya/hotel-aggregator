import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SetMetadata, UseGuards, UnauthorizedException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Hotel } from './hotel.schema';
import { User } from './user.schema';
import { CreateHotelDto } from "./dtos/create-hotel.dto";
import { UpdateHotelDto } from "./dtos/update-hotel.dto";
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from '../../../login-microservice/login.guard';
import { RolesGuard } from '../../../login-microservice/role.guard';
import { ApiTags } from '@nestjs/swagger';
// import { GraphqlExceptionFilter } from './hotel-exception.filter';
// import { CustomErrorInterceptor } from './custom-error.interceptor';

@ApiTags('hotels')
@Resolver(() => Hotel)
//@UseFilters(GraphqlExceptionFilter)
//@UseInterceptors(CustomErrorInterceptor)
export class HotelResolver {
  constructor(private readonly hotelService: HotelService) {}

  @Query(() => [Hotel])
  async getAllHotels(): Promise<Hotel[]> {
    try {
      return this.hotelService.getAllHotels();
    } catch (error) {
      throw new BadRequestException(
        'Some error occurred',
        { cause: new Error(), description: 'Some error occurred.Please Try again.' })
    }
  }

  @Query(() => [String])
  async getLocations(): Promise<string[]> {
    try {
      return this.hotelService.getLocations();
    } catch (error) {
      throw new BadRequestException(
        'Some error occurred',
        { cause: new Error(), description: 'Some error occurred.Please Try again.' })
    }
  }

  @Query(() => Hotel)
    async getHotelByLocation(@Args('loc') location: string): Promise<Hotel> {
    try{
      return this.hotelService.getHotelByLocation(location);
    } catch (error) {
      throw new BadRequestException(
        'Some error occurred',
        { cause: new Error(), description: 'Some error occurred.Please Try again.' })
    }
  }

  @Query(() => Hotel)
    async getHotelByName(@Args('hotelTitle') hotelTitle: string): Promise<Hotel> {
    try{
      return this.hotelService.getHotelByName(hotelTitle);
    } catch (error) {
      throw new BadRequestException(
        'Some error occurred',
        { cause: new Error(), description: 'Some error occurred.Please Try again.' })
    }
  }

  @Query(() => String)
  async billing() {
    return await this.hotelService.billing();
  }

  
  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['dealer', 'admin'])
  async addHotel(@Args('input') input: CreateHotelDto) {
    try {
      await this.hotelService.addHotel(input);
      return true;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  @Mutation(() => Hotel)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['dealer', 'admin'])
  async updateHotel(@Args('input') input: UpdateHotelDto): Promise<Hotel> {
    return this.hotelService.updateHotel(input._id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['dealer', 'admin'])
  async deleteHotel(
    @Args('_id', { type: () => ID }) _id: string,
  ): Promise<boolean> {
    return this.hotelService.deleteHotel(_id);
  }

  @Mutation(() => User)
  async login(@Args('credentials') credentials: CreateUserDto) {
    const result = await this.hotelService.login(credentials);
    if (result) {
      return {
        email: result.user.email,
        password: result.user.password,
        token: result.token
      }
    } else {
      throw new UnauthorizedException('User is not registered with the App');
    }
  }

}
