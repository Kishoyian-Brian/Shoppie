import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { ProductsService, Product } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../service/cart.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landingpage.html',
  styleUrls: ['./landingpage.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LandingPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(private router: Router, private productService: ProductsService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.filteredProducts = this.products;
        this.isLoading = false;
      },
      error: () => {
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
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Product): void {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
    };
    this.cartService.addToCart(cartItem);
    alert(`${product.name} has been added to your cart.`);
  }
}
