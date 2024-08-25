import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/config/security';
import { AuthenticatedUser, JwtContext } from 'src/common/const/types/auth';

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
      role: payload.role,
      permissions: payload.permissions,
    };
  }
}