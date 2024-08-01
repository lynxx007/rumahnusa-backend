import { Controller, Post } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { LoginPayload } from './payloads/loginPayload';
import { Body } from '@nestjs/common';
import { RegistrationPayload } from './payloads/registrationPayload';

@Controller('auth')
export class AuthenticationsController {
  constructor(private readonly authenticationsService: AuthenticationsService) {}

  @Post('login')
  login(@Body() payload: LoginPayload) {
    return this.authenticationsService.validateLogin(payload);
  }

  @Post('register')
  register(@Body() payload: RegistrationPayload) {
    return this.authenticationsService.validateRegistration(payload);
    //TODO: Activity Log
  }
}
