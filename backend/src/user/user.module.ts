import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ApiResponseService } from '../shared/api-response.service';
import { PrismaClient } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, ApiResponseService, PrismaClient, ConfigService],
  controllers: [UsersController],
})
export class UsersModule {}
