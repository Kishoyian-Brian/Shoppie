import { Routes } from '@angular/router';
import { LandingPage } from './components/landingpage/landingpage';
import { ProductsComponent } from './components/shop/shop';
import { AdminProductComponent } from './components/admin-dashboard/admin-dashboard';
import { Authorized } from './components/authorized/authorized';
import { Login } from './components/login/login';

export const routes: Routes = [
    {
        path: 'landingpage',
        component: LandingPage,
    },
    {
        path: 'shop',
        component: ProductsComponent,
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
    }
];
