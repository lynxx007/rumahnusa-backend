import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Database Configuration
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from 'src/config/database';

@Module({
  imports: [TypeOrmModule.forRoot(DB_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
