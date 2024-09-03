import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/const/app.const';
import { AuthenticatedUser, JwtContext } from 'src/types/auth.types';

@Injectable()
export class AuthenticationStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: AuthenticatedUser): Promise<JwtContext> {
    return {
      id: payload.id,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone_number: payload.phone_number,
      role: payload.role,
      permissions: payload.permissions,
      is_verified: payload.is_verified,
    };
  }
}