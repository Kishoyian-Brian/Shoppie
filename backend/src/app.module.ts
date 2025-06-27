import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { MailerModule } from './mailer/mailer.module';
import { PrismaClient } from 'generated/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule, 
    UsersModule, 
    AuthModule, 
    CartModule, 
    MailerModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaClient],
})
export class AppModule { }
