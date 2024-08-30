import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './applications/app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { APP_PORT } from './const/app.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );
  app.setGlobalPrefix('v1');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(APP_PORT);
}
bootstrap();
