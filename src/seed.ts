import { NestFactory } from '@nestjs/core';
import { SeederService } from './database/seeder/service.seeder';
import { AppModule } from './applications/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeederService);

  await seeder.seed();

  await app.close();
}

bootstrap();
