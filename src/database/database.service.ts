import { Injectable, Inject } from '@nestjs/common';
import * as mariadb from 'mariadb';

import { IDatabase } from './interfaces';
import { DATABASE_CONFIG } from './constants/database.constant';

@Injectable()
export class DatabaseService {
  private readonly pool: mariadb.Pool;

  constructor(@Inject(DATABASE_CONFIG) private config: IDatabase) {
    this.pool = mariadb.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      multipleStatements: config.multipleStatements,
      dateStrings: config.dateStrings,
    });
  }

  async query(queryString: string, params: string[] = []): Promise<any> {
    try {
      const res = await this.pool.query(queryString, [...params]);
      delete res.meta;
      return res;
    } catch (error) {
      throw error;
    }
  }
}
