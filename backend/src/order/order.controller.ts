import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}

class CreateOrderDto {
  productId: string;
  quantity: number;
  totalPrice?: number;
}

class CreateOrderFromCartDto {
  items: Array<{
    productId: string;
    quantity: number;
    totalPrice: number;
  }>;
  shippingAddress?: string;
  paymentMethod?: string;
}

class UpdateOrderStatusDto {
  status: string;
}

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Req() req: RequestWithUser,
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ) {
    try {
      const order = await this.orderService.createOrder(req.user.id, createOrderDto);
      return { message: 'Order created successfully', order };
    } catch (error) {
      return { message: 'Failed to create order', error: error.message };
    }
  }

  @Post('from-cart')
  async createOrderFromCart(
    @Req() req: RequestWithUser,
    @Body(new ValidationPipe()) createOrderFromCartDto: CreateOrderFromCartDto,
  ) {
    try {
      const order = await this.orderService.createOrderFromCart(req.user.id, createOrderFromCartDto);
      return { message: 'Order created successfully from cart', order };
    } catch (error) {
      return { message: 'Failed to create order from cart', error: error.message };
    }
  }

  @Get()
  async getOrders(@Req() req: RequestWithUser) {
    try {
      const orders = await this.orderService.getOrders(req.user.id);
      return { message: 'Orders retrieved successfully', orders };
    } catch (error) {
      return { message: 'Failed to retrieve orders', error: error.message };
    }
  }

  @Get(':id')
  async getOrderById(@Req() req: RequestWithUser, @Param('id') id: string) {
    try {
      const order = await this.orderService.getOrderById(req.user.id, id);
      return { message: 'Order retrieved successfully', order };
    } catch (error) {
      return { message: 'Failed to retrieve order', error: error.message };
    }
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    try {
      const updatedOrder = await this.orderService.updateOrderStatus(
        req.user.id,
        id,
        updateOrderStatusDto.status,
      );
      return { message: 'Order status updated successfully', updatedOrder };
    } catch (error) {
      return { message: 'Failed to update order status', error: error.message };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelOrder(@Req() req: RequestWithUser, @Param('id') id: string) {
    try {
      await this.orderService.cancelOrder(req.user.id, id);
      return { message: 'Order cancelled successfully' };
    } catch (error) {
      return { message: 'Failed to cancel order', error: error.message };
    }
  }
}
