import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProductsService, Product } from '../../service/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
        } else {
          console.error('Failed to load products:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    console.log('Add to cart clicked for product:', product);
    // TODO: Implement add to cart functionality
  }
}
