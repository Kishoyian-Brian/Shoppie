import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductsService, CreateProductDto, UpdateProductDto } from '../../service/product.service';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  form: CreateProductDto | UpdateProductDto = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stockQuantity: 0
  };
  selectedProduct: Product | null = null;
  showModal = false;

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
      },
    });
  }

  openAddModal(): void {
    this.selectedProduct = null;
    this.form = {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      stockQuantity: 0
    };
    this.showModal = true;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.form = { ...product };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form = {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      stockQuantity: 0
    };
    this.selectedProduct = null;
  }

  onSubmit(): void {
    if (this.selectedProduct) {
      // update
      this.productService.updateProduct(this.selectedProduct.id, this.form).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: () => alert('Failed to update product')
      });
    } else {
      // create
      this.productService.createProduct(this.form as CreateProductDto).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: () => alert('Failed to add product')
      });
    }
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
      },
      error: () => {
        alert('Failed to delete product');
      },
    });
  }
}
