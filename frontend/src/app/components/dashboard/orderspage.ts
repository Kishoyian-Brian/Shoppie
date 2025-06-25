import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth';
import { Router } from '@angular/router';
import { OrdersService, Order } from '../../service/orders.service';

@Component({
  selector: 'app-orderspage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orderspage.html',
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getUserOrders().subscribe({
      next: (response) => {
        this.orders = response;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }
}
