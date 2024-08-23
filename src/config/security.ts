import * as dotenv from 'dotenv';
dotenv.config();

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 5;
export const JWT_SECRET = process.env.JWT_SECRET || 'LZ-STARTER';
