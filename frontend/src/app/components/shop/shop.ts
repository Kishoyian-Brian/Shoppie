import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService, Product, ApiResponse } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService, CartItem } from '../../service/cart.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Shop implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  filterBy = '';
  sortBy = 'priceLow';
  fallbackImage = 'assets/placeholder-image.png';

  constructor(private productService: ProductsService, private router: Router, private cartService: CartService) {}

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
        return matchesSearch;
      });
    this.sortProducts();
  }

  resetFilters(): void {
    this.searchTerm = '';
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
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
    };
    // Assuming you have a CartService injected, add the product to the cart
    // If CartService is not injected, inject it in the constructor first
    this.cartService.addToCart(cartItem);
    alert(`${product.name} has been added to your cart.`);
  }

  isOutOfStock(product: Product): boolean {
    return product.stockQuantity <= 0;
  }

  goToAccount(): void {
    this.router.navigate(['/account']);
  }
}
