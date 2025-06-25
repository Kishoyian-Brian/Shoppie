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
  imageFile: File | null = null;

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
    this.imageFile = null;
    this.showModal = true;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.form = { ...product };
    this.imageFile = null;
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
    this.imageFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.form.name || '');
    formData.append('description', this.form.description || '');
    formData.append('price', this.form.price !== undefined ? this.form.price.toString() : '0');
    formData.append('stock', this.form.stockQuantity !== undefined ? this.form.stockQuantity.toString() : '0');
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.selectedProduct) {
      // update
      this.productService.updateProduct(this.selectedProduct.id, formData as any).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: () => alert('Failed to update product')
      });
    } else {
      // create
      this.productService.createProduct(formData as any).subscribe({
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
