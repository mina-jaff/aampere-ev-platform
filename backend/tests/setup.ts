import 'reflect-metadata';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

dotenv.config({ path: '.env.test' });

jest.setTimeout(30000);
