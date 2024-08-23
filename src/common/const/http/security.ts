import { JWT_SECRET } from 'src/config/security';
import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_OPTIONS: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: '30d',
  },
};