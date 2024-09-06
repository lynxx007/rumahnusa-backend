import { IsString, IsOptional } from 'class-validator';

export class UpdateProfilePayload {

  @IsOptional()
  @IsString()
  readonly first_name: string;

  @IsOptional()
  @IsString()
  readonly last_name: string;

  @IsOptional()
  @IsString()
  readonly phone_number: string;

  profile_picture: string | null;
}
