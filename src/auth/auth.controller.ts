import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('hotels')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { email: string, password: string }) {
    const { token } = await this.authService.login(credentials);
    if (token) {
        return { token };
      }
      else {
        return {message: 'User is not registered with app'}
      }
  }
}
