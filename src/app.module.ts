import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { FilesModule } from './files/files.module';
import { TracksModule } from './api/tracks/tracks.module';
import { JwtAuthGuard } from './api/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
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
    FilesModule,
    TracksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
