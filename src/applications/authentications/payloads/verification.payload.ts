import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationPayload {
    @IsEmail()
    @IsNotEmpty()
  readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly otp: string;
}