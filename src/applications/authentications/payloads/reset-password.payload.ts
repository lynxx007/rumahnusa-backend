import { IsNotEmpty, IsStrongPassword, ValidateIf, IsIn, IsString } from 'class-validator';
import { PASSWORD_VALIDATION_OPTIONS } from 'src/const/options.const';

export class ResetPasswordPayload {

    @IsNotEmpty()
    @IsString()
  readonly token: string;

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