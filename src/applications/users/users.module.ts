import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthenticationsModule } from '../authentications/authentications.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Role]), AuthenticationsModule],
})
export class UsersModule {}
