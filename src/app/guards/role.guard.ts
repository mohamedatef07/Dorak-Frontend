import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRole'];
    const userRole = this.authService.getUserRole();

    if (!this.authService.isAuthenticated() || !userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    const hasRole = Array.isArray(expectedRoles)
      ? expectedRoles.includes(userRole)
      : userRole === expectedRoles;

    if (hasRole) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
