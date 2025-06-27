import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { ApiResponseService } from '../shared/api-response.service';
import { PrismaClient } from 'generated/prisma';
import { getPrismaClient } from '../prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule,
  ],
  providers: [
    AuthService,
    ApiResponseService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: PrismaClient,
      useFactory: () => getPrismaClient(),
    },
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
