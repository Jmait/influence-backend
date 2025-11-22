import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'wallet-service',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  // migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
  ssl: false,
  connectTimeoutMS: 10000,
  extra: {
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
  },
});
