import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { ValidationPipe } from './pipes';
import { JwtAuthGuard } from './api/auth/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new JwtAuthGuard());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
