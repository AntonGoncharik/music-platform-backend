import { Module, Global, DynamicModule } from '@nestjs/common';

import { Database } from './interfaces/database.interface';
import { DATABASE_CONFIG } from './constants/database.constant';
import { DatabaseService } from './database.service';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config: Database): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_CONFIG,
          useValue: config,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
