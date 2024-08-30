import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configurations
import { DB_CONFIG } from 'src/database/config';

// Modules
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SeederModule } from 'src/database/seeder/main.seeder';
import { AuthenticationsModule } from './authentications/authentications.module';
import { UsersModule } from './users/users.module';

//Custom Validation Rules
import { IsUniqueConstraint } from 'src/rules/isUniqueConstraint';


@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONFIG), 
    UsersModule, 
    AuthenticationsModule, 
    RolesModule, 
    PermissionsModule, 
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
