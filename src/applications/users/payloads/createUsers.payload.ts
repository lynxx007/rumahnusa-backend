import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';
import { passwordValidationOption } from 'src/common/const/validation_options/passwordValidation';
import { IsUnique } from 'src/common/decorators/IsUnique';

export class CreateUsersPayload {
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
  @IsStrongPassword(passwordValidationOption)
  readonly password: string;

  @IsNotEmpty()
  readonly role_id: string;
}
