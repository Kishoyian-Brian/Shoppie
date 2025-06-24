import { Routes } from '@angular/router';
import { LandingPage } from './components/landingpage/landingpage';
import { AdminProductComponent } from './components/admin-dashboard/admin-dashboard';
import { Login } from './components/login/login';
import { Shop } from './components/shop/shop';
import {AuthGuard} from './components/guards/auth.guard';
import {RoleGuard} from './components/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landingpage',
    pathMatch: 'full'
  },
  {
    path: 'landingpage',
    component: LandingPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'shop',
    component: Shop,
  },
  {
    path: 'admin-dashboard',
    component: AdminProductComponent,
    canActivate: [AuthGuard,RoleGuard],
    data:{roles:['admin']}
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

