import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-product.html',
})
export class ViewProduct {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{ product: Product, quantity: number }>();
  quantity: number = 1;

  onAddToCart() {
    if (this.product) {
      this.addToCart.emit({ product: this.product, quantity: this.quantity });
    }
  }
}
