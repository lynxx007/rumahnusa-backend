import { Module } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService],
  exports: [AuthenticationsService],
})
export class AuthenticationsModule {}
