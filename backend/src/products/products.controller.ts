import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProducts } from 'src/dto/create-product.dto';
import { UpdateProducts } from 'src/dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponseService } from '../shared/api-response.service';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Req() req: RequestWithUser,
    @Body() createProductDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const productData = {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: parseInt(createProductDto.stock) || 0,
        image: createProductDto.image,
        imageBuffer: file?.buffer,
      };

      const product = await this.productsService.createProduct(productData);
      return this.apiResponse.created(product, 'Product created successfully');
    } catch (error) {
      return this.apiResponse.error(
        'Failed to create product',
        500,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const products = await this.productsService.findAll();
      return this.apiResponse.ok(products, 'Products retrieved successfully');
    } catch (error) {
      return this.apiResponse.error(
        'Failed to retrieve products',
        500,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      return this.apiResponse.ok(product, 'Product retrieved successfully');
    } catch (error) {
      return this.apiResponse.error(
        'Failed to retrieve product',
        500,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const productData = {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
        stock: parseInt(updateProductDto.stock) || 0,
        image: updateProductDto.image,
        imageBuffer: file?.buffer,
      };

      const updatedProduct = await this.productsService.updateProduct(
        id,
        productData,
      );
      return this.apiResponse.ok(updatedProduct, 'Product updated successfully');
    } catch (error) {
      return this.apiResponse.error(
        'Failed to update product',
        500,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Req() req: RequestWithUser, @Param('id') id: string) {
    try {
      await this.productsService.deleteProduct(id);
      return this.apiResponse.ok(null, 'Product deleted successfully');
    } catch (error) {
      return this.apiResponse.error(
        'Failed to delete product',
        500,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
