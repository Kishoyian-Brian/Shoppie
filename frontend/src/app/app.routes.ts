import { Routes } from '@angular/router';
import { LandingPage } from './components/landingpage/landingpage';
import { Login } from './components/login/login';
import { CartPage } from './components/dashboard/cartpage';
import { Dashboard } from './components/dashboard/dashboard';
import { PaymentPage } from './components/dashboard/paymentpage';
import { Orders } from './components/orders/orders';
import { AuthGuard } from './components/guards/auth.guard';
import { RoleGuard } from './components/guards/role.guard';
import { AdminProductComponent } from './components/admin-dashboard/admin-dashboard';

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
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin-dashboard',
    component: AdminProductComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/cart',
    component: CartPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/payment',
    component: PaymentPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/orders',
    component: Orders,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'orders',
    component: Orders,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'landingpage'
  }
];

