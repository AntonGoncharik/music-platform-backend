import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const token = this.generateToken(user.id, userDto);

    return { user: { id: user.id }, token };
  }

  async signup(userDto: CreateUserDto) {
    const users = await this.userService.getUserByEmail(userDto.email);

    if (users.length) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const userId = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    const token = this.generateToken(userId, userDto);

    return { user: { id: userId }, token };
  }

  private generateToken(userId: number, userDto: CreateUserDto) {
    const payload = { email: userDto.email, id: userId };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const users = await this.userService.getUserByEmail(userDto.email);

    if (users.length) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        users[0].password,
      );

      if (passwordEquals) {
        return users[0];
      }
    }

    throw new UnauthorizedException({
      message: 'Invalid email or password',
    });
  }
}
