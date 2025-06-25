import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
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
export class AdminProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  /**
   * Create a new product with optional image upload
   * @param product Product details
   * @param imageFile Optional image file to upload
   */
  createProduct(product: CreateProductDto, imageFile?: File): Observable<ApiResponse<any>> {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('category', product.category);

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.post<ApiResponse<any>>(this.apiUrl, formData);
  }
}
