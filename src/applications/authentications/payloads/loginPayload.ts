import { IsNotEmpty } from 'class-validator';
  
export class LoginPayload {
    @IsNotEmpty()
  readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
  