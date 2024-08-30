import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './user.entity';
import { Role } from '../roles/role.entity';


// Modules
import { AuthenticationsModule } from '../authentications/authentications.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Role]), AuthenticationsModule],
})
export class UsersModule {}
