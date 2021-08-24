import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  find(token: string) {
    return this.userService.getUserByToken(token);
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(avatar, userDto);
  }
}
