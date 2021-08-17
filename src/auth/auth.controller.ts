import { Controller, Body, Post, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

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
  active(@Req() request: Request, @Res() response: Response) {
    console.log(request.params.link);
    response.redirect(`${process.env.API_URL}/auth/signin`, 301);
    return 1;
    // return this.authService.signup(userDto);
  }
}
