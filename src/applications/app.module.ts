import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Database Configuration
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from 'src/config/database';
import { UsersModule } from './users/users.module';

//Custom Validation Rules
import { IsUniqueConstraint } from 'src/common/rules/isUniqueConstraint';

@Module({
  imports: [TypeOrmModule.forRoot(DB_CONFIG), UsersModule],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
