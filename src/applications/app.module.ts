import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configurations
import { DB_CONFIG } from 'src/database/config';
import { MAILER_OPTIONS, STATIC_FILE_OPTIONS } from 'src/const/app.const';

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
    ServeStaticModule.forRoot(STATIC_FILE_OPTIONS),
    TypeOrmModule.forRoot(DB_CONFIG), 
    MailerModule.forRoot(MAILER_OPTIONS),
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
