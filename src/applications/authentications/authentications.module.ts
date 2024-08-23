import { Module } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from 'src/common/const/http/security';

// Entities
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register(JWT_OPTIONS)],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService],
  exports: [AuthenticationsService],
})
export class AuthenticationsModule {}
