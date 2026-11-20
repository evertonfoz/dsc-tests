import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { createValidationPipe } from './common/config/validation-pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    createValidationPipe(),
  );
  const port = process.env.PORT || 3200;
  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
await bootstrap();
