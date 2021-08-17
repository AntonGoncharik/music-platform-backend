import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DatabaseModule.forRoot({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      multipleStatements: process.env.DATABASE_MULTIPLE_STATEMENTS === 'true',
      dateStrings: process.env.DATABASE_DATE_STRING === 'true',
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
