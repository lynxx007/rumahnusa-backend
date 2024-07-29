import * as dotenv from 'dotenv';
dotenv.config();

export const APP_PORT: number = (process.env.PORT as unknown as number) || 8000;
