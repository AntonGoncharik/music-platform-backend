import { Module, Global, DynamicModule } from '@nestjs/common';

import { IDatabase } from './interfaces';
import { DATABASE_CONFIG } from './constants';
import { DatabaseService } from './database.service';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config: IDatabase): DynamicModule {
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
