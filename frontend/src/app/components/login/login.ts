import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  toggleMode() {
    this.error = null;
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin() {
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      this.isLoading = false;
      if (this.loginData.email === 'user@example.com' && this.loginData.password === '1234') {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid login credentials';
      }
    }, 1000);
  }

  onRegister() {
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      this.isLoading = false;
      if (this.registerData.email && this.registerData.password) {
        this.router.navigate(['/welcome']);
      } else {
        this.error = 'Please fill all fields correctly';
      }
    }, 1000);
  }
}
