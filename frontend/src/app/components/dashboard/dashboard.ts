import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../service/product.service';
import { ProductEventsService } from '../../service/product-events.service';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  private productSubscription: Subscription | undefined;
  addingToCart: { [productId: string]: boolean } = {};

  constructor(
    private productsService: ProductsService,
    private productEventsService: ProductEventsService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    // Subscribe to product events to reload products when admin adds new ones
    this.productSubscription = this.productEventsService.productAdded$.subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        // Handle both response formats (statusCode or success)
        if ((response.statusCode === 200 || response.success === true) && response.data) {
          this.products = response.data;
          this.filteredProducts = response.data;
        } else {
          console.error('Failed to load products:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }
  }

  addToCart(product: Product): void {
    console.log('Add to cart clicked for product:', product);
    // Set loading state for this product
    this.addingToCart[product.id] = true;
    // Add to cart via CartService (handles guest or logged-in)
    this.cartService.addToCart(product.id, 1, {
      name: product.name,
      price: product.price,
      imageUrl: product.image
    }).subscribe({
      next: () => {
        console.log('Product added to cart successfully');
        this.addingToCart[product.id] = false;
        alert('Product added to cart!');
      },
      error: (error) => {
        console.error('Failed to add product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
        this.addingToCart[product.id] = false;
      }
    });
  }

  isAddingToCart(productId: string): boolean {
    return this.addingToCart[productId] || false;
  }
}
