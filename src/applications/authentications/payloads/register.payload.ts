import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  ValidateIf,
  IsIn,
} from 'class-validator';
import { PASSWORD_VALIDATION_OPTIONS } from 'src/const/options.const';
import { IsUnique } from 'src/decorators/IsUnique';
  
export class RegistrationPayload {
    @IsNotEmpty()
    @IsEmail()
    @IsUnique({ tableName: 'users', column: 'email' })
  readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    readonly first_name: string;
  
    @IsNotEmpty()
    @IsString()
    readonly last_name: string;
  
    @IsNotEmpty()
    @IsStrongPassword(PASSWORD_VALIDATION_OPTIONS)
    readonly password: string;

    @IsNotEmpty()
    @IsIn([Math.random()], {
      message: 'Passwords do not match',
    })
    @ValidateIf((o) => o.password !== o.password_confirmation)
      password_confirmation: string;
}
  