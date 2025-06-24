import { Component, OnInit } from '@angular/core';
import { ProductsService, Product, ApiResponse } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Shop implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  priceFilter = 1000;
  sortBy = 'priceLow';
  fallbackImage = 'assets/placeholder-image.png';

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts()
      .pipe(
        catchError(error => {
          console.error('Error fetching products:', error);
          this.errorMessage = 'Failed to load products. Please try again.';
          return of({ success: false, message: 'Error', data: [] } as ApiResponse<Product[]>);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response.success && response.data) {
          this.products = response.data;
          this.filteredProducts = response.data;
          this.applyFilters();
        } else {
          this.errorMessage = response.error || 'Failed to load products';
        }
      });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.productService.searchProducts(this.searchTerm)
        .pipe(
          catchError(error => {
            console.error('Error searching products:', error);
            return of({ success: false, message: 'Error', data: [] } as ApiResponse<Product[]>);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response.success && response.data) {
            this.products = response.data;
            this.applyFilters();
          } else {
            this.errorMessage = response.error || 'Search failed';
          }
        });
    } else {
      this.loadProducts();
    }
  }

  applyFilters(): void {
    this.filteredProducts = this.products
      .filter(product => {
        const matchesSearch = !this.searchTerm ||
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesPrice = product.price <= this.priceFilter;
        return matchesSearch && matchesPrice;
      });
    this.sortProducts();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.priceFilter = 1000;
    this.sortBy = 'priceLow';
    this.filteredProducts = [...this.products];
    this.applyFilters();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch(this.sortBy) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
  }

  addToCart(product: Product): void {
    // Implement your cart logic here
    console.log('Adding to cart:', product);
  }

  isOutOfStock(product: Product): boolean {
    return product.stockQuantity <= 0;
  }
}
