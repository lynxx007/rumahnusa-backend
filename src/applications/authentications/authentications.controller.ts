import { Controller, Post, HttpCode, Put } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { LoginPayload } from './payloads/login.payload';
import { Body } from '@nestjs/common';
import { RegistrationPayload } from './payloads/register.payload';
import { EmailVerificationPayload } from './payloads/verification.payload';
import { ResendEmailVerificationPayload } from './payloads/resend-verification.payload';
import { RequestPasswordResetPayload } from './payloads/request-password-reset.payload';
import { ResetPasswordPayload } from './payloads/reset-password.payload';

@Controller('auth')
export class AuthenticationsController {
  constructor(private readonly authenticationsService: AuthenticationsService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() payload: LoginPayload) {
    return this.authenticationsService.validateLogin(payload);
  }

  @Post('register')
  register(@Body() payload: RegistrationPayload) {
    return this.authenticationsService.validateRegistration(payload);
    //TODO: Activity Log
  }

  @Post('verify')
  verify(@Body() payload: EmailVerificationPayload) {
    return this.authenticationsService.verifyEmail(payload);
  }

  @Put('verify/resend')
  resendVerifyEmail(@Body() payload: ResendEmailVerificationPayload) {
    return this.authenticationsService.resendVerificationEmail(payload);
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() payload: RequestPasswordResetPayload) {
    return this.authenticationsService.requestPasswordReset(payload);
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() payload: ResetPasswordPayload) {
    return this.authenticationsService.resetPassword(payload);
  }

}
