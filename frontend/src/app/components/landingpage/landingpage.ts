import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { ProductsService, Product } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth';
import { ProductEventsService } from '../../service/product-events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landingpage.html',
  styleUrls: ['./landingpage.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LandingPage implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  addingToCart: { [productId: string]: boolean } = {};
  private productSubscription: Subscription | undefined;

  constructor(
    private router: Router, 
    private productService: ProductsService, 
    private cartService: CartService,
    private authService: AuthService,
    private productEventsService: ProductEventsService
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
    console.log('Loading products...');
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('Products response:', res);
        // Handle both response formats (statusCode or success)
        if ((res.statusCode === 200 || res.success === true) && res.data) {
          this.products = res.data;
          this.filteredProducts = this.products;
          console.log('Products loaded:', this.products.length);
        } else {
          console.error('Invalid response format:', res);
          this.errorMessage = 'Invalid response from server.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }

  navigateToProduct(productId: string): void {
    // For now, just show an alert since there's no product detail page
    // TODO: Implement product detail page
    alert('Product detail page not implemented yet. You can add this product to cart instead.');
  }

  addToCart(product: Product): void {
    // Check if user is logged in first
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    // Set loading state for this product
    this.addingToCart[product.id] = true;
    
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        alert(`${product.name} has been added to your cart.`);
        this.addingToCart[product.id] = false;
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
        if (error.message === 'User not logged in') {
          alert('Please log in to add items to your cart.');
          this.router.navigate(['/login']);
        } else {
          alert('Failed to add item to cart. Please try again.');
        }
        this.addingToCart[product.id] = false;
      }
    });
  }

  isAddingToCart(productId: string): boolean {
    return this.addingToCart[productId] || false;
  }
}
