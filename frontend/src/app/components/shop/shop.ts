import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  fallbackImage = 'https://placehold.co/400x300?text=No+Image';
  searchTerm = '';

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchTerm.trim();

    if (!query) {
      this.loadProducts();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.searchProducts(query).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Search failed. Try again.';
        this.isLoading = false;
      }
    });
  }
}
