import * as dotenv from 'dotenv';
import { JwtModuleOptions } from '@nestjs/jwt';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
dotenv.config();

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 5;
export const JWT_SECRET = process.env.JWT_SECRET || 'LZ-STARTER';
export const APP_PORT: number = (process.env.PORT as unknown as number) || 8000;
export const DEFAULT_ROLE_NAME = process.env.DEFAULT_ROLE_NAME || 'User';
export const APP_NAME: string = process.env.APP_NAME || 'Lezenda';

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = Number(process.env.MAIL_PORT);
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_FROM = process.env.MAIL_FROM;


export const JWT_OPTIONS: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: '30d',
  },
};

export const MAILER_OPTIONS: MailerOptions = {
  transport: {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  },
  defaults: {
    from: `"${APP_NAME}" <${MAIL_FROM}>`,
  },
  template: {
    dir: join(__dirname, '..','mail', 'templates'),
    adapter: new EjsAdapter(),
    options: {
      strict: true,
    },
  },
};