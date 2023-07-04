import { MessagePattern } from '@nestjs/microservices';
import { Controller, Post, Get, Body, Param, HttpCode,
  HttpException, HttpStatus, BadRequestException, Delete, Put } from "@nestjs/common";
import { LoginService } from './login.service';
import { User } from './login.interface';
import { CreateUserDto } from './create-user.dto';


@Controller('/users')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @MessagePattern('LOGIN_MICROSERVICE')
  async login(credentials: { email: string, password: string }) {
    const token = await this.loginService.validateUser(credentials.email, credentials.password);
    return { token };
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    try {
      return this.loginService.getAllUsers();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is an error while fetching data',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  @Post('/register')
      //@HttpCode(204)
      async addHotel(@Body() user: CreateUserDto): Promise<User> {
        try {
          return this.loginService.addUser(user);
        } catch (error) {
          throw new BadRequestException(
            'Something bad happened',
            { cause: new Error(), description: 'Some error description' })
        }
      }
}
