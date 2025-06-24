import { Routes } from '@angular/router';
import { LandingPage } from './components/landingpage/landingpage';
import { AdminProductComponent } from './components/admin-dashboard/admin-dashboard';
import { Authorized } from './components/authorized/authorized';
import { Login } from './components/login/login';
import { Shop } from './components/shop/shop';

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
    component: AdminProductComponent,
  },
  {
    path: 'authorized',
    component: Authorized,
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
