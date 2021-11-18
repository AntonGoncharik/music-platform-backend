import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Redirect,
  Headers,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { RefreshDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @ApiOperation({ summary: 'Signin user' })
  @ApiBody({
    description: 'User authorization data',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User has been signed in.',
    schema: {
      example: {
        user: { id: 'id' },
        tokens: {
          token: 'token',
          refreshToken: 'refreshToken',
        },
      },
    },
  })
  signin(@Body() userDto: CreateUserDto) {
    return this.authService.signin(userDto);
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Signup user' })
  @ApiBody({
    description: 'User registration data',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User has been created.',
    schema: {
      example: {
        user: { id: 'id' },
        tokens: {
          token: 'token',
          refreshToken: 'refreshToken',
        },
      },
    },
  })
  signup(@Body() userDto: CreateUserDto) {
    return { hi: 'hello' };
    // return this.authService.signup(userDto);
  }

  @Get('/active/:link')
  @Redirect('http://localhost:3000/auth', 301)
  @ApiOperation({ summary: 'Activation user by link' })
  @ApiParam({
    name: 'link',
    type: 'string',
    required: true,
    description: 'link is a string from email',
    example: 'c7a571eb-fb44-4525-bd24-30a042c56fc1',
  })
  @ApiResponse({
    status: 200,
    description: 'User has been activated.',
  })
  active(@Param() params) {
    this.authService.active(params.link);
  }

  @Get('/refresh')
  @ApiOperation({ summary: 'Refresh user tokens' })
  @ApiBody({
    description: 'Refresh token from user',
    type: RefreshDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Token has been refreshed.',
    schema: {
      example: {
        user: { id: 'id' },
        tokens: {
          token: 'token',
          refreshToken: 'refreshToken',
        },
      },
    },
  })
  refresh(@Headers() headers) {
    return this.authService.refresh(headers.authorization);
  }
}
