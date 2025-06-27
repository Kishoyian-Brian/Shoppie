import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<any>(this.apiUrl + '/login', credentials).pipe(
      tap(response => {
        console.log('AuthService login response data:', response.data);
        const user = response.data?.user;
        const token = response.data?.token;
        if (token && user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);
          this.currentUserSubject.next(user);
          console.log('Calling redirectBasedOnRole with role:', user.role);
          this.redirectBasedOnRole(user.role);
        }
      }),
      catchError((error: any) => {
        console.error('Login HTTP error:', error);
        throw error;
      })
    );
  }

  signup(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/register', userData).pipe(
      catchError((error: any) => {
        console.error('Signup HTTP error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role.toLowerCase() === 'admin' : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private redirectBasedOnRole(role: string): void {
    console.log('Redirecting based on role:', role);
    const normalizedRole = role.toLowerCase();
    switch (normalizedRole) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']).then(success => {
          if (!success) {
            console.error('Navigation to /admin-dashboard failed');
          }
        }).catch(err => console.error('Navigation error:', err));
        break;
      case 'user':
      default:
        this.router.navigate(['/shop']).then(success => {
          if (!success) {
            console.error('Navigation to /dashboard/cart failed');
          }
        }).catch(err => console.error('Navigation error:', err));
    }
  }
}
