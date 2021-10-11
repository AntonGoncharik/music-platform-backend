import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqid = require('uniqid');

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
    try {
      const user = await this.validateUserPassword(userDto);
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
    } catch (error) {
      throw error;
    }
  }

  async signup(userDto: CreateUserDto) {
    try {
      const users = await this.userService.getUserByEmail(userDto.email);

      if (users[0]) {
        throw new BadRequestException({
          message: 'User with this email exists',
        });
      }

      const activationLink = uniqid();
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
    } catch (error) {
      throw error;
    }
  }

  async active(activationLink: string) {
    try {
      const users = await this.userService.getUserByActivationLink(
        activationLink,
      );

      if (!users[0]) {
        throw new BadRequestException({
          message: 'User not found',
        });
      }

      if (users[0].active) {
        throw new BadRequestException({
          message: 'User has been activated',
        });
      }

      await this.userService.updateUser(null, {
        id: users[0].id,
        active: 1,
      });
    } catch (error) {
      throw error;
    }
  }

  async refresh(authorizationTokens: string) {
    try {
      const token = authorizationTokens.split(' ')[1];
      const refreshToken = authorizationTokens.split(' ')[2];

      const result = await this.databaseService.query(
        `SELECT refresh_token, user_id
          FROM tokens
          WHERE refresh_token = ?
          LIMIT 1;
        `,
        [refreshToken],
      );

      if (!result[0]) {
        throw new BadRequestException({
          message: 'Refresh token not found',
        });
      }

      const user = await this.databaseService.query(
        `SELECT email
          FROM users
          WHERE id = ?
          LIMIT 1;
        `,
        [result[0].user_id],
      );

      const tokens = this.generateTokens(result[0].user_id, {
        email: user[0].email,
        password: '',
      });

      await this.databaseService.query(
        `UPDATE tokens
          SET token = ?, refresh_token = ?
          WHERE user_id = ?;
        `,
        [tokens.token, tokens.refreshToken, result[0].user_id],
      );

      return {
        user: { id: result[0].user_id },
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  verify(token: string, options: { secret: string }) {
    return this.jwtService.verify(token, options);
  }

  private generateTokens(userId: string, userDto: CreateUserDto) {
    const payload = { id: userId, email: userDto.email };

    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_TOKEN_SECRET_KEY,
        expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      }),
    };
  }

  private async validateUserPassword(userDto: CreateUserDto) {
    try {
      const users = await this.userService.getUserByEmail(`${userDto.email}`);

      if (users[0]) {
        const passwordEquals = await bcrypt.compare(
          userDto.password,
          users[0].password,
        );

        if (passwordEquals) {
          return { id: users[0].id };
        }
      }

      throw new UnauthorizedException({
        message: 'Invalid email or password',
      });
    } catch (error) {
      throw error;
    }
  }
}
