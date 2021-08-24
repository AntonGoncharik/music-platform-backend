import { Controller, Body, Post, Get, Param, Redirect } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() userDto: CreateUserDto) {
    return this.authService.signin(userDto);
  }

  @Post('/signup')
  signup(@Body() userDto: CreateUserDto) {
    return this.authService.signup(userDto);
  }

  @Get('/active/:link')
  @Redirect(`${process.env.API_URL}/auth/signin`, 301)
  active(@Param() params) {
    this.authService.active(params.link);
  }
}
