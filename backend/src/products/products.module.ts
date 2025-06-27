import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ApiResponseService } from '../shared/api-response.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [ProductsService, ApiResponseService],
  controllers: [ProductsController]
})
export class ProductsModule {}
