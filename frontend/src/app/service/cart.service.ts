import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    // Load cart from localStorage or initialize empty
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    } else {
      this.cartItemsSubject.next([]);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: CartItem): void {
    const items = this.cartItemsSubject.value;
    const index = items.findIndex(i => i.productId === item.productId);
    if (index > -1) {
      items[index].quantity += item.quantity;
    } else {
      items.push(item);
    }
    this.cartItemsSubject.next(items);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.cartItemsSubject.value;
    const index = items.findIndex(i => i.productId === productId);
    if (index > -1) {
      items[index].quantity = quantity;
      if (quantity <= 0) {
        items.splice(index, 1);
      }
      this.cartItemsSubject.next(items);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCart();
  }

  placeOrder(): Observable<any> {
    // Call backend API to place order with current cart items
    const orderPayload = {
      items: this.cartItemsSubject.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
    return this.http.post('/api/orders', orderPayload);
  }
}
