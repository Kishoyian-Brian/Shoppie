import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update.cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: RequestWithUser) {
    console.log('Cart GET request - req.user:', req.user);
    console.log('Cart GET request - req:', req);
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addToCart(@Req() req: RequestWithUser, @Body() addToCartDto: AddToCartDto) {
    console.log('Cart POST request - req.user:', req.user);
    console.log('Cart POST request - req:', req);
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('items/:id')
  updateCartItem(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, id, updateCartItemDto);
  }

  @Delete('items/:id')
  removeFromCart(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete('clear')
  clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
}
