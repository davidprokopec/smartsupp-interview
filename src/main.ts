import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { processMigrations } from './drizzle/utils';

async function bootstrap() {
  await processMigrations();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
