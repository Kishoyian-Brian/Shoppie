import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { ApiResponseService } from '../shared/api-response.services';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService, ApiResponseService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
