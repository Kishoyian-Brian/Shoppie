import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductsService, CreateProductDto, UpdateProductDto } from '../../service/product.service';
import { ProductEventsService } from '../../service/product-events.service';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-dashboard.html',
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

  form: (CreateProductDto & { category: string; image?: string }) | (UpdateProductDto & { category: string; image?: string }) = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    category: '',
    image: ''
  };
  selectedProduct: Product | null = null;
  showModal = false;
  imageFile: File | null = null;

  constructor(private productService: ProductsService, private productEventsService: ProductEventsService) {}

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
      stock: 0,
      category: '',
      image: ''
    };
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
      stock: 0,
      category: '',
      image: ''
    };
    this.selectedProduct = null;
    this.imageFile = null;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.form = { ...product, category: (product as any).category || '', image: (product as any).image || '' };
    this.imageFile = null;
    this.showModal = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, or WebP)');
        input.value = '';
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        input.value = '';
        return;
      }
      
      this.imageFile = file;
    }
  }

  onSubmit(): void {
    if (this.isLoading) return; // Prevent multiple submissions
    
    this.isLoading = true;
    const formData = new FormData();
    formData.append('name', this.form.name || '');
    formData.append('description', this.form.description || '');
    formData.append('price', this.form.price !== undefined ? this.form.price.toString() : '0');
    formData.append('stock', this.form.stock !== undefined ? this.form.stock.toString() : '0');
    formData.append('category', this.form.category || '');
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.selectedProduct) {
      // update
      this.productService.updateProduct(this.selectedProduct.id, formData as any).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Update product error:', err);
          let errorMessage = 'Failed to update product';
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.error?.error) {
            errorMessage = err.error.error;
          }
          alert(errorMessage);
          this.isLoading = false;
        }
      });
    } else {
      // create
      this.productService.createProduct(formData as any).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.isLoading = false;
          // Notify other components that a product was added
          this.productEventsService.notifyProductAdded();
        },
        error: (err) => {
          console.error('Add product error:', err);
          let errorMessage = 'Failed to add product';
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.error?.error) {
            errorMessage = err.error.error;
          }
          alert(errorMessage);
          this.isLoading = false;
        }
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

  viewProduct(product: Product): void {
    this.selectedProduct = product;
    // Optionally, you can show a product details modal here
  }
} 