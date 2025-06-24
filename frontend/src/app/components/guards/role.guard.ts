// guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../service/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    const requiredRoles = route.data['roles'] as Array<string>;

    if (!user || !requiredRoles.includes(user.role.toLowerCase())) {
      // Redirect to landing page if user doesn't have required role
      this.router.navigate(['/landingpage']);
      return false;
    }

    return true;
  }
}
