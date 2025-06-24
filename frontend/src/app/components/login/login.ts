import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth';
@Component({
  selector: 'app-shop-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  loginData = {
    email: '',
    password: '',
  };

  registerData = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  toggleMode() {
    this.error = null;
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin() {
    this.isLoading = true;
    this.error = null;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.message === 'Login successful' && response.user) {
          // Add a console log to debug the user role
          console.log('User role:', response.user.role);

          switch(response.user.role.toLowerCase()) {
            case 'admin':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'user':
              this.router.navigate(['/landingpage']);
              break;
            default:
              // Handle any unexpected role
              console.warn('Unexpected user role:', response.user.role);
              this.router.navigate(['/landingpage']);
          }
        } else {
          this.error = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.error = error.error?.message || 'An error occurred during login';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    this.isLoading = true;
    this.error = null;

    this.authService.signup(this.registerData).subscribe({
      next: (response) => {
        if (response.message === 'User registered successfully') {
          this.isLoginMode = true; // Switch to login mode
          // Clear the registration form
          this.registerData = {
            name: '',
            email: '',
            password: '',
          };
          // You might want to show a success message
          this.error = 'Registration successful! Please log in.';
        } else {
          this.error = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'An error occurred during registration';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
