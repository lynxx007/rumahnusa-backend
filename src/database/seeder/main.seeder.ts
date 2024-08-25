import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/applications/users/user.entity';
import { Role } from 'src/applications/roles/role.entity';
import { Permission } from 'src/applications/permissions/permission.entity';
import { AuthenticationsModule } from 'src/applications/authentications/authentications.module';
import { SeederService } from './service.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User, Role]), AuthenticationsModule],
  providers: [SeederService],
})
export class SeederModule {}
