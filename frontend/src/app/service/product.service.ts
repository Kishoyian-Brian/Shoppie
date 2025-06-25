import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  stockQuantity?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all available products from backend
   */
  getAllProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl);
  }

  /**
   * Fetch a single product by its ID
   * @param id Product ID
   */
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search products by query string (name match)
   * @param query Search string
   */
  searchProducts(query: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/search/${query}`);
  }

  /**
   * Create a new product
   * @param product Product data
   */
  createProduct(product: CreateProductDto | FormData): Observable<ApiResponse<Product>> {
    if (product instanceof FormData) {
      return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
    } else {
      return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
    }
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param product Updated product data
   */
  updateProduct(id: string, product: UpdateProductDto | FormData): Observable<ApiResponse<Product>> {
    if (product instanceof FormData) {
      return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
    } else {
      return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
    }
  }

  /**
   * Delete a product by ID
   * @param id Product ID
   */
  deleteProduct(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
