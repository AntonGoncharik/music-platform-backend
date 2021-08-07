export interface Database {
  host: string;
  user: string;
  password: string;
  database: string;
  multipleStatements: boolean;
  dateStrings: boolean;
}
