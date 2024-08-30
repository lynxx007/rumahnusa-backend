import * as dotenv from 'dotenv';
import { JwtModuleOptions } from '@nestjs/jwt';
dotenv.config();

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 5;
export const JWT_SECRET = process.env.JWT_SECRET || 'LZ-STARTER';
export const APP_PORT: number = (process.env.PORT as unknown as number) || 8000;
export const DEFAULT_ROLE_NAME = process.env.DEFAULT_ROLE_NAME || 'User';


export const JWT_OPTIONS: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: '30d',
  },
};