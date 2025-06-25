import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../service/cart.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.html',
  styleUrls: ['./cartpage.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  isPlacingOrder = false;
  orderSuccessMessage = '';
  orderErrorMessage = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 0) return;
    this.cartService.updateQuantity(productId, quantity);
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
      next: () => {
        this.isPlacingOrder = false;
        this.orderSuccessMessage = 'Order placed successfully!';
        this.cartService.clearCart();
        this.router.navigate(['/dashboard/payment']);
      },
      error: () => {
        this.isPlacingOrder = false;
        this.orderErrorMessage = 'Failed to place order. Please try again.';
      }
    });
  }
}
