import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetPayload {
    
    @IsNotEmpty()
    @IsEmail()
  readonly email: string;
}