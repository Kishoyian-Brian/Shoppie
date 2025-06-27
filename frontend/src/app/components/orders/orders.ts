import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService, Order } from '../../service/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  standalone: true
})
export class Orders implements OnInit, OnDestroy {
  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  private subscriptions = new Subscription();

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.ordersService.getUserOrders().subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
          console.log('Orders loaded:', orders);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load orders. Please try again.';
          console.error('Failed to load orders:', error);
        }
      })
    );
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.subscriptions.add(
        this.ordersService.cancelOrder(orderId).subscribe({
          next: () => {
            // Reload orders after cancellation
            this.loadOrders();
          },
          error: (error) => {
            console.error('Failed to cancel order:', error);
            this.errorMessage = 'Failed to cancel order. Please try again.';
          }
        })
      );
    }
  }

  viewOrderDetails(orderId: string): void {
    // For now, just show an alert. In a real app, you'd navigate to a detailed view
    alert(`Order details for order ${orderId} would be displayed here.`);
  }

  getTotalSpent(): number {
    return this.orders.reduce((total, order) => total + order.totalPrice, 0);
  }
}
