import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseService } from '../../database/database.service';
import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../../mail/mail.service';
import { getTemplateRegistartionEmail } from './templates';
import { MUSIC_PLATFORM_REGISTRATION } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private databaseService: DatabaseService,
  ) {}

  async signin(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const tokens = this.generateTokens(user.id, userDto);

    await this.databaseService.query(
      `UPDATE tokens
        SET token = ?, refresh_token = ?
        WHERE user_id = ?;
      `,
      [tokens.token, tokens.refreshToken, `${user.id}`],
    );

    return {
      user: { id: user.id },
      tokens,
    };
  }

  async signup(userDto: CreateUserDto) {
    const users = await this.userService.getUserByEmail(userDto.email);

    if (users[0]) {
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
    const tokens = this.generateTokens(`${userId}`, userDto);

    await this.databaseService.query(
      `INSERT INTO tokens (token, refresh_token, user_id)
        VALUES (?, ?, ?);
      `,
      [tokens.token, tokens.refreshToken, `${userId}`],
    );

    await this.mailService.sendMail({
      to: userDto.email,
      subject: MUSIC_PLATFORM_REGISTRATION,
      html: getTemplateRegistartionEmail(activationLink),
    });

    return { user: { id: userId }, tokens };
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

  private generateTokens(userId: string, userDto: CreateUserDto) {
    const payloadToken = { email: userDto.email, id: userId, date: Date.now() };
    const payloadRefreshToken = { email: userDto.email, id: userId };

    return {
      token: this.jwtService.sign(payloadToken),
      refreshToken: this.jwtService.sign(payloadRefreshToken),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const users = await this.userService.getUserByEmail(userDto.email);

    if (users[0]) {
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
