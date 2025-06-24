import { Routes } from '@angular/router';
import { Landingpage } from './components/landingpage/landingpage';
import { Shop } from './components/shop/shop';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { Authorized } from './components/authorized/authorized';
import { Login } from './components/login/login';
export const routes: Routes = [
    {
        path: 'landingpage',
        component: Landingpage,
    },
      {
        path:'shop',
        component: Shop,
      },
    {
        path: 'admin-dashboard',
        component:AdminDashboard
    },

    {
        path: 'authoruzed',
        component: Authorized
    },
    {
        path :'login',
        component:Login
    }

];
