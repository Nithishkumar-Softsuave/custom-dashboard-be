export enum DBType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  //   MONGODB = 'mongodb',
}

export interface IDbCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
