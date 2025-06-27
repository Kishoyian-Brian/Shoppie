import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export interface CartItem {
  id?: string;
  cartId?: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string; // For guest cart display
  imageUrl?: string; // For guest cart display
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface AddToCartWithDetailsRequest {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private localStorageKey = 'guest_cart_items';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Listen to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // User logged in, load their cart
        this.loadCartFromBackend().subscribe();
      } else {
        // User logged out, load guest cart
        this.loadCartFromLocalStorage();
      }
    });
    // On init, load correct cart
    if (this.authService.isLoggedIn()) {
      this.loadCartFromBackend().subscribe();
    } else {
      this.loadCartFromLocalStorage();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Cart service error:', error);
    return throwError(() => error);
  }

  // Load cart from backend
  loadCartFromBackend(): Observable<CartItem[]> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in'));
    }

    this.isLoadingSubject.next(true);
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(cartResponse => {
        console.log('Cart response:', cartResponse);
        // Backend returns cart object with CartItem array, not just array of items
        const cartItems = cartResponse.CartItem || [];
        this.cartItemsSubject.next(cartItems);
        this.isLoadingSubject.next(false);
      }),
      catchError(error => {
        this.isLoadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  // Guest cart helpers
  private loadCartFromLocalStorage(): void {
    const items = localStorage.getItem(this.localStorageKey);
    let cartItems: CartItem[] = [];
    try {
      cartItems = items ? JSON.parse(items) : [];
    } catch {
      cartItems = [];
    }
    this.cartItemsSubject.next(cartItems);
    this.isLoadingSubject.next(false);
  }

  private saveCartToLocalStorage(cartItems: CartItem[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(cartItems));
    this.cartItemsSubject.next(cartItems);
  }

  // Get current cart items (from local state)
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Add item to cart (hybrid)
  addToCart(productId: string, quantity: number, productDetails?: { name?: string; price?: number; imageUrl?: string }): Observable<any> {
    if (this.authService.isLoggedIn()) {
      const payload: AddToCartRequest = { productId, quantity };
      return this.http.post(this.apiUrl + '/items', payload, { headers: this.getAuthHeaders() }).pipe(
        tap(() => {
          this.loadCartFromBackend().subscribe();
        }),
        catchError(this.handleError)
      );
    } else {
      // Guest cart logic with product details
      let cartItems = this.cartItemsSubject.value.slice();
      const idx = cartItems.findIndex((item: CartItem) => item.productId === productId);
      if (idx > -1) {
        cartItems[idx].quantity += quantity;
      } else {
        cartItems.push({ 
          productId, 
          quantity, 
          price: productDetails?.price || 0,
          name: productDetails?.name,
          imageUrl: productDetails?.imageUrl
        });
      }
      this.saveCartToLocalStorage(cartItems);
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  // Remove item from cart (hybrid)
  removeFromCart(itemId: string): Observable<any> {
    if (this.authService.isLoggedIn()) {
      return this.http.delete(`${this.apiUrl}/items/${itemId}`, { headers: this.getAuthHeaders() }).pipe(
        tap(() => {
          this.loadCartFromBackend().subscribe();
        }),
        catchError(this.handleError)
      );
    } else {
      let cartItems = this.cartItemsSubject.value.slice();
      cartItems = cartItems.filter((item: CartItem) => item.productId !== itemId && item.id !== itemId);
      this.saveCartToLocalStorage(cartItems);
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  // Update cart item quantity (hybrid)
  updateCartItemQuantity(itemId: string, quantity: number): Observable<any> {
    if (this.authService.isLoggedIn()) {
      const payload: UpdateCartRequest = { quantity };
      return this.http.put(`${this.apiUrl}/items/${itemId}`, payload, { headers: this.getAuthHeaders() }).pipe(
        tap(() => {
          this.loadCartFromBackend().subscribe();
        }),
        catchError(this.handleError)
      );
    } else {
      let cartItems = this.cartItemsSubject.value.slice();
      const idx = cartItems.findIndex((item: CartItem) => item.productId === itemId || item.id === itemId);
      if (idx > -1) {
        if (quantity < 1) {
          cartItems.splice(idx, 1);
        } else {
          cartItems[idx].quantity = quantity;
        }
        this.saveCartToLocalStorage(cartItems);
      }
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  // Clear cart (hybrid)
  clearCart(): Observable<any> {
    if (this.authService.isLoggedIn()) {
      return this.http.delete(`${this.apiUrl}/clear`, { headers: this.getAuthHeaders() }).pipe(
        tap(() => {
          this.cartItemsSubject.next([]);
        }),
        catchError(this.handleError)
      );
    } else {
      this.saveCartToLocalStorage([]);
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Get cart item count
  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }

  // Check if cart is empty
  isCartEmpty(): boolean {
    return this.cartItemsSubject.value.length === 0;
  }

  // Place order: only for logged in users
  placeOrder(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User must be logged in to place an order.'));
    }
    const cartItems = this.getCartItems();
    if (cartItems.length === 0) {
      return throwError(() => new Error('Cannot place order with empty cart'));
    }
    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      }))
    };
    return this.http.post('http://localhost:3000/order/from-cart', orderPayload, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        this.clearCart().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  clearCartOnLogout(): void {
    this.cartItemsSubject.next([]);
    this.loadCartFromLocalStorage();
  }
}
