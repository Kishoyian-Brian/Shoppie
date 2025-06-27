import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../service/cart.service';
import { AuthService } from '../../service/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.html',
  styleUrls: ['./cartpage.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isLoading = false;
  isPlacingOrder = false;
  orderSuccessMessage = '';
  orderErrorMessage = '';
  private subscriptions = new Subscription();

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    console.log('CartPage initialized');
    // Don't call loadCart() here - cart items are loaded via subscription
    // Subscribe to cart items changes
    this.subscriptions.add(
      this.cartService.cartItems$.subscribe(items => {
        console.log('Cart items updated:', items);
        this.cartItems = items;
      })
    );

    // Subscribe to loading state
    this.subscriptions.add(
      this.cartService.isLoading$.subscribe(loading => {
        console.log('Cart loading state:', loading);
        this.isLoading = loading;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCart(): void {
    // This method is no longer needed since cart items are loaded via subscription
    // The CartService handles loading from backend (for logged-in users) or localStorage (for guests)
    console.log('Cart items should be loaded via subscription');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) {
      // Remove item if quantity is less than 1
      this.removeFromCart(itemId);
      return;
    }

    this.cartService.updateCartItemQuantity(itemId, quantity).subscribe({
      next: () => {
        // Quantity updated successfully
      },
      error: (error) => {
        console.error('Failed to update quantity:', error);
        this.orderErrorMessage = 'Failed to update quantity. Please try again.';
      }
    });
  }

  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        // Item removed successfully
      },
      error: (error) => {
        console.error('Failed to remove item:', error);
        this.orderErrorMessage = 'Failed to remove item. Please try again.';
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        // Cart cleared successfully
      },
      error: (error) => {
        console.error('Failed to clear cart:', error);
        this.orderErrorMessage = 'Failed to clear cart. Please try again.';
      }
    });
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      this.orderErrorMessage = 'Cart is empty.';
      return;
    }

    this.isPlacingOrder = true;
    this.orderSuccessMessage = '';
    this.orderErrorMessage = '';

    this.cartService.placeOrder().subscribe({
      next: (response) => {
        this.isPlacingOrder = false;
        console.log('Order placed successfully:', response);
        this.orderSuccessMessage = 'Order placed successfully! Redirecting to orders page...';
        
        // Redirect to orders page after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard/orders']);
        }, 2000);
      },
      error: (error) => {
        this.isPlacingOrder = false;
        console.error('Failed to place order:', error);
        this.orderErrorMessage = error.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  isCartEmpty(): boolean {
    return this.cartService.isCartEmpty();
  }
}
