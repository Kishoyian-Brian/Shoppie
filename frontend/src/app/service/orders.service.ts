import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
  };
}

export interface OrderResponse {
  message: string;
  orders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserOrders(): Observable<Order[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.get<OrderResponse>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('Orders response:', response);
      }),
      catchError(error => {
        console.error('Failed to fetch orders:', error);
        return throwError(() => error);
      })
    ).pipe(
      map(response => response.orders || [])
    );
  }

  getOrderById(orderId: string): Observable<Order> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.get<any>(`${this.apiUrl}/${orderId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('Order response:', response);
      }),
      catchError(error => {
        console.error('Failed to fetch order:', error);
        return throwError(() => error);
      })
    ).pipe(
      map(response => response.order)
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.put(`${this.apiUrl}/${orderId}/status`, 
      { status }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Failed to update order status:', error);
        return throwError(() => error);
      })
    );
  }

  cancelOrder(orderId: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.delete(`${this.apiUrl}/${orderId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Failed to cancel order:', error);
        return throwError(() => error);
      })
    );
  }
}
