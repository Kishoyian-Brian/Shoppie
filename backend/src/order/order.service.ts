import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { getPrismaClient } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  private prisma: PrismaClient = getPrismaClient();

  async createOrder(userId: string, createOrderDto: any) {
    try {
      // Create order for single product with quantity and orderStatus
      const order = await this.prisma.order.create({
        data: {
          userId,
          productId: createOrderDto.productId,
          quantity: createOrderDto.quantity,
          orderStatus: 'PENDING',
          totalPrice: createOrderDto.totalPrice || 0,
        },
      });
      return order;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async createOrderFromCart(userId: string, createOrderFromCartDto: any) {
    try {
      const { items } = createOrderFromCartDto;
      
      // Create multiple orders for each cart item
      const orders = await Promise.all(
        items.map(async (item: any) => {
          return await this.prisma.order.create({
            data: {
              userId,
              productId: item.productId,
              quantity: item.quantity,
              orderStatus: 'PENDING',
              totalPrice: item.totalPrice,
            },
          });
        })
      );

      // Clear the user's cart after successful order creation
      await this.clearUserCart(userId);

      return orders;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private async clearUserCart(userId: string) {
    try {
      // Find user's cart
      const cart = await this.prisma.cart.findFirst({
        where: { userId },
        include: { CartItem: true }
      });

      if (cart && cart.CartItem.length > 0) {
        // Delete all cart items
        await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Don't throw error as order creation was successful
    }
  }

  async getOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          product: true,
        },
      });
      return orders;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getOrderById(userId: string, orderId: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId, userId },
        include: {
          product: true,
        },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async updateOrderStatus(userId: string, orderId: string, status: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId, userId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: status as any },
      });
      return updatedOrder;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async cancelOrder(userId: string, orderId: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId, userId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      await this.prisma.order.delete({
        where: { id: orderId },
      });
      return null;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
