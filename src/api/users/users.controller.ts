import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'User has been gotten.',
    schema: {
      example: ['1'],
    },
  })
  find(@Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    return this.userService.getUserByToken(token);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'User has been created.',
    schema: {
      example: 1,
    },
  })
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User has been updated.',
  })
  update(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(avatar, userDto);
  }
}
