import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
@Module({
  imports:  
  [
    ConfigModule.forRoot({
      isGlobal : true ,
      envFilePath : ".env" 
      
    }) ,
    PrismaModule, 
    AuthModule, UsersModule, CategoryModule, ProductModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
