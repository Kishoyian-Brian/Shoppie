import { Routes } from '@angular/router';
import { LandingPage } from './components/landingpage/landingpage';
import { AdminProductComponent } from './components/admin-dashboard/admin-dashboard';
import { Login } from './components/login/login';
import { Shop } from './components/shop/shop';
import { CartPage } from './components/dashboard/cartpage';
import { Dashboard } from './components/dashboard/dashboard';
import { PaymentPage } from './components/dashboard/paymentpage';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landingpage',
    pathMatch: 'full'
  },
  {
    path: 'landingpage',
    component: LandingPage,
  },
  {
    path: 'shop',
    component: Shop,
  },
  {
    path: 'admin-dashboard',
    component: AdminProductComponent
    
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'dashboard/cart',
    component: CartPage,
  },
  {
    path: 'dashboard/payment',
    component: PaymentPage,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '**',
    redirectTo: 'landingpage'
  }
];

