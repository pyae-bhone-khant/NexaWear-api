import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule }  from '@nestjs/swagger';

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
      transformOptions : {
        enableImplicitConversion : true 
      }
    }),
  );  

  // Enable Cors 
  app.enableCors({
    origin : process.env.ALLOWED_ORIGING?.split(',') ?? "http://localhost:3000" , 
    credentials : true , 
    methods : ['GET' , 'POST' , 'PUT' ,'DELETE' , 'PATCH' , 'OPTIONS'] , 
    allowedHeaders : ['Content-type' , 'Authorization' , 'Accept'] ,  
  }) 

  // Enble Swagger docs 
  const config = new DocumentBuilder()
  .setTitle('Api Documentation ')
  .setDescription('Api for Nest js ')
  .setVersion('1.0')
  .addTag('Api')
  .addBearerAuth(
    {
      type : 'http' , 
      scheme : 'bearer' , 
      bearerFormat : 'JWT' , 
      name : 'Authorization' , 
      description : 'Access JWT token ' , 
      in : 'header' ,
    } , 
    'JWR_auth' , 
  )
  .addBearerAuth(
    {

type : 'http' , 
      scheme : 'bearer' , 
      bearerFormat : 'JWT' , 
      name : 'Authorization' , 
      description : 'Refresh JWT token ' , 
      in : 'header' ,
    } ,
    'JWT_Refresh'
  ) 
  .addServer('http://localhost:3001' , 'Development server')
  .build()
  
  const document  = SwaggerModule.createDocument(app , config)
  SwaggerModule.setup('api/docs' , app , document , { 
    swaggerOptions : {
      tagsSorter : 'alpha' , 
      operationsSorter : "alpha" 
    } , 
    customSiteTitle : 'Api Documentation',
    customfavIcon : 'https://nestjs.com/img/logo-small.svg',  
    customCss : ` 
      .swagger-ui .topbar {display : none } 
      .swagger-ui .info {margin : 50px 0 ; }
      .swagger-ui .info .title {color : #4A90E2 ; } 
    ` 
  })

  await app.listen(process.env.PORT ?? 7000);
}
bootstrap().catch((error) =>  {
  Logger.error("Error starting sever"  , error) 
  process.exit(1);
});
