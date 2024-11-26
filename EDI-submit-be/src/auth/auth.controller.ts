import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
@Public()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() userDto: CreateUserDto, @Request() req) {
    return this.authService.registerUser(userDto);
  }

  @Get('heath-check')
  healthcheck() {
    return "Welcome to Phelebotomy !!";
  }
}
