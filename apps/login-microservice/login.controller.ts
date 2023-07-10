import { MessagePattern } from '@nestjs/microservices';
import { Controller, Post, Get, Body, HttpException, HttpStatus, UnauthorizedException, UseGuards, Session, Res } from "@nestjs/common";
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
  async getAllUsers(@Session() session: Record<string, any>): Promise<User[]> {
    try {
      const user = session.user;
      if (!user) {
        throw new UnauthorizedException('Session has been expired. User need to login again!');
      }
      return this.loginService.getAllUsers();
    } catch (error) {
      console.log(error)
      if(error.response.error !== 'Unauthorized') {
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
      async addHotel(@Body() user: CreateUserDto): Promise<any> {
          const userVal = await this.loginService.addUser(user);
          if (!userVal) {
            throw new UnauthorizedException('User already exists with this email id');
          }
          return userVal;
      }

      @Get('/logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.user = null;
    res.redirect('/hotels');
  }


}
