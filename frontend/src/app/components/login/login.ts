import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  error: string | null = null;
  registrationSuccessMessage: string | null = null;

  isLoginMode = true;
  registerData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    console.log('Login attempt with email:', this.email);
    this.isLoading = true;
    this.error = null;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        if (response.message === 'Login successful' && response.user) {
          console.log('Login successful, navigation should happen');
          // Navigation handled in auth service redirectBasedOnRole
          this.isLoading = false;
        } else {
          this.error = response.message || 'Login failed';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'An error occurred during login';
        this.isLoading = false;
      }
    });
  }

  onRegister(): void {
    console.log('Register attempt with data:', this.registerData);
    this.isLoading = true;
    this.error = null;
    this.registrationSuccessMessage = null;

    this.authService.signup(this.registerData).subscribe({
      next: (response) => {
        console.log('Register response:', response);
        if (response.message === 'User registered successfully') {
          this.error = null;
          this.isLoading = false;
          this.registrationSuccessMessage = 'Registration successful! A confirmation email has been sent to your email address.';
          this.isLoginMode = true; // Switch to login mode after successful registration
        } else {
          this.error = response.message || 'Registration failed';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.error = err.error?.message || 'An error occurred during registration';
        this.isLoading = false;
      }
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.registrationSuccessMessage = null;
  }
}
