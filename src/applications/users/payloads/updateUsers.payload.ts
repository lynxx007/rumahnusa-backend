import { IsString, IsOptional, IsEmail, IsStrongPassword } from 'class-validator';

export class UpdateUsersPayload {
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly first_name: string;

  @IsOptional()
  @IsString()
  readonly last_name: string;

  @IsOptional()
  @IsStrongPassword()
  readonly password: string;
}
