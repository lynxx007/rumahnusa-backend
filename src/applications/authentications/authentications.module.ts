import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { JWT_OPTIONS } from 'src/const/app.const';
import { AuthenticationStrategy } from './strategy/jwt.strategy';

// Entities
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), JwtModule.register(JWT_OPTIONS), PassportModule],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService, AuthenticationStrategy],
  exports: [AuthenticationsService],
})
export class AuthenticationsModule {}
