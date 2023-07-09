import { MessagePattern } from '@nestjs/microservices';
import { Controller, Post, Get, Body, HttpException, HttpStatus, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from './login.guard';
import { LoginService } from './login.service';
import { User } from './login.interface';
import { CreateUserDto } from './dtos/create-user.dto';


@Controller('/users')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @MessagePattern('validate_user')
  async login(credentials: { email: string, password: string }) {
    return await this.loginService.validateUser(credentials.email, credentials.password);
  }

  @Get()
  @UseGuards(AuthGuard)
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
      async addHotel(@Body() user: CreateUserDto): Promise<any> {
          const userVal = await this.loginService.addUser(user);
          if (!userVal) {
            throw new UnauthorizedException('User already exists with this email id');
          }
          return userVal;
      }

}
