import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const dbConfig = {
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'wallet-service',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  ssl: false,
  // Add connection retry settings
  retryAttempts: 10,
  retryDelay: 3000,
  keepConnectionAlive: true,
  // Add connection timeout
  connectTimeoutMS: 10000,
  extra: {
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
  },
};

export const databaseConfig: TypeOrmModuleOptions = dbConfig;

export const AppDataSource = new DataSource(dbConfig);
