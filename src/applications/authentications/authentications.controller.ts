import { Controller, Post } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { LoginPayload } from './payloads/loginPayload';
import { Body } from '@nestjs/common';

@Controller('auth')
export class AuthenticationsController {
  constructor(private readonly authenticationsService: AuthenticationsService) {}

  @Post('login')
  login(@Body() payload: LoginPayload) {
    return this.authenticationsService.validateLogin(payload);
  }
}
