import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports:  
  [
    ConfigModule.forRoot({
      isGlobal : true ,
      envFilePath : ".env" 
    })  ,
    PrismaModule, 
    AuthModule,  
    UsersModule, 
     CategoryModule, 
      ProductModule, 
       OrderModule   , 
       ThrottlerModule.forRoot([
        {
          ttl : 60 ,  // second 
          limit : 10  // ten request pr 60 second 
        } , 
       ])
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
