import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { error } from 'node:console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add prefix url 
  app.setGlobalPrefix('api/v1'); 

  // app validation pipe  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 7000);
}
bootstrap().catch((error) =>  {
  Logger.error("Error starting sever"  , error) 
  process.exit(1);
});
