import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-paymentpage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paymentpage.html',
})
export class PaymentPage {
  paymentSuccessMessage = '';
  paymentErrorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  submitPayment() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Simulate payment processing
    this.paymentSuccessMessage = 'Payment successful! Thank you for your order.';
    this.paymentErrorMessage = '';

    // After a delay, navigate to landing page or order confirmation page
    setTimeout(() => {
      this.router.navigate(['/landingpage']);
    }, 3000);
  }
}
