import { Injectable } from '@nestjs/common';
import * as mariadb from 'mariadb';

@Injectable()
export class DatabaseService {
  pool: mariadb.Pool;

  constructor() {
    this.pool = mariadb.createPool({
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'test',
      multipleStatements: true,
      dateStrings: true,
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
