import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress?: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
    image?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserOrders(): Observable<Order[]> {
    const token = this.authService.getToken();
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
