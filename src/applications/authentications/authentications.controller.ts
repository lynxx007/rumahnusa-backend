import { Controller, Post, HttpCode } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { LoginPayload } from './payloads/login.payload';
import { Body } from '@nestjs/common';
import { RegistrationPayload } from './payloads/register.payload';

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
}
