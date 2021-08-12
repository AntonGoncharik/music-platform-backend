export interface IDatabase {
  host: string;
  user: string;
  password: string;
  database: string;
  multipleStatements: boolean;
  dateStrings: boolean;
}
