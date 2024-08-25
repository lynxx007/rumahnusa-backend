import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationsService } from 'src/applications/authentications/authentications.service';

//Entities
import { Permission } from 'src/applications/permissions/permission.entity';
import { User } from 'src/applications/users/user.entity';
import { Role } from 'src/applications/roles/role.entity';

import { adminPermissions } from './variables.seeder';

@Injectable()
export class SeederService {
  constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly authService: AuthenticationsService
  ){}
    
  async seed() {

    const userPassword = await this.authService.hashPassword('User123#');
    const adminPassword = await this.authService.hashPassword('Admin123#');

    // Seed Permissions
    const permissionIds: Permission[] = adminPermissions.map((permission) => {
      const generatedData = new Permission();
      generatedData.title = permission;
      return generatedData;
    });

    await this.permissionRepository.save(permissionIds);

    // Seed Roles
    const userRole = new Role();
    userRole.title = 'User';

    const adminRole = new Role();
    adminRole.title = 'Administrator';
    adminRole.permissions = permissionIds;

    await this.roleRepository.save([userRole, adminRole]);

    await this.userRepository.save({
      first_name: 'User Lezenda',
      last_name: 'Dev',
      email: 'user@lezenda.com',
      password: userPassword,
      role: userRole,
    });

    await this.userRepository.save({
      first_name: 'Admin Lezenda',
      last_name: 'Dev',
      email: 'admin@lezenda.com',
      password: adminPassword,
      role: adminRole,
    });
  }
}