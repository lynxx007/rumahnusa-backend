import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';
import { PASSWORD_VALIDATION_OPTIONS } from 'src/const/options.const';
import { IsUnique } from 'src/decorators/IsUnique';
import { Role } from 'src/applications/roles/role.entity';

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
  @IsUnique({ tableName: 'users', column: 'phone_number' })
  readonly phone_number: string;

  @IsNotEmpty()
  @IsStrongPassword(PASSWORD_VALIDATION_OPTIONS)
  readonly password: string;

  @IsNotEmpty()
  readonly role: Partial<Role>;

  profile_picture: string | null;
}
