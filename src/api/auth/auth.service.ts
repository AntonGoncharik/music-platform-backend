import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../../modules/mail/mail.service';
import { getTemplateRegistartionEmail } from './templates';
import { MUSIC_PLATFORM_REGISTRATION } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
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

    const activationLink = uuidv4();
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const userId = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
      activationLink,
    });
    const token = this.generateToken(`${userId}`, userDto);

    await this.mailService.sendMail({
      to: userDto.email,
      subject: MUSIC_PLATFORM_REGISTRATION,
      html: getTemplateRegistartionEmail(activationLink),
    });

    return { user: { id: userId }, token };
  }

  async active(activationLink: string) {
    const users = await this.userService.getUserByActivationLink(
      activationLink,
    );

    if (!users.length) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (users[0].active) {
      throw new HttpException(
        'User has been activated',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.updateUser(null, {
      id: users[0].id,
      active: 1,
    });
  }

  private generateToken(userId: string, userDto: CreateUserDto) {
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