import { Controller, Post, HttpCode, Put } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { LoginPayload } from './payloads/login.payload';
import { Body } from '@nestjs/common';
import { RegistrationPayload } from './payloads/register.payload';
import { EmailVerificationPayload } from './payloads/verification.payload';
import { ResendEmailVerificationPayload } from './payloads/resend-verification.payload';

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

}
