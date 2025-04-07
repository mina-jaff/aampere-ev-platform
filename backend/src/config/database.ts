import { DataSource } from 'typeorm';
import { Vehicle } from '../models/Vehicle';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Vehicle],
  synchronize: true, // In production, use migrations instead
  logging: process.env.NODE_ENV === 'development' === true
});
