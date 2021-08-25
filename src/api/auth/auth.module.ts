import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_TOKEN_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_TOKEN_EXPIRATION_TIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MailModule,
  ],
})
export class AuthModule {}
