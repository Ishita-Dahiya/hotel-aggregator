import { MessagePattern } from '@nestjs/microservices';
import { Controller, Post, Get, Body, Delete, HttpException, HttpStatus, UnauthorizedException, UseGuards, Session, Res, HttpCode, Put, Param } from "@nestjs/common";
import { AuthGuard } from './login.guard';
import { LoginService } from './login.service';
import { User } from './login.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';



@Controller('/users')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @MessagePattern({ cmd: 'validate_user' })
  async login(credentials: { email: string, password: string }) {
    return await this.loginService.validateUser(credentials.email, credentials.password);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(): Promise<User[]> {
    try {
      return this.loginService.getAllUsers();
    } catch (error) {
      console.log(error)
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

  @Post('/register')
  async addUser(@Body() user: CreateUserDto): Promise<any> {
    const userVal = await this.loginService.addUser(user);
    if (!userVal) {
      throw new UnauthorizedException('User already exists with this email id');
    }
    return userVal;
  }

  @Put(':id')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: string, @Body() user: CreateUserDto): Promise<any> {
    return this.loginService.updateUser(id, user);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.loginService.deleteUser(id);
  }

  // @Get('/logout')
  // logout(@Res() res: Response) {
  //   res.redirect('/api/hotels');
  // }

}
