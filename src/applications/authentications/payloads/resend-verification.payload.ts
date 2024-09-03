import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResendEmailVerificationPayload {
    @IsNotEmpty()
    @IsEmail()
  readonly email: string;
}