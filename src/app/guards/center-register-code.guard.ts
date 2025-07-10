import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CenterRegisterCodeService } from '../services/center-register-code.service';

@Injectable({ providedIn: 'root' })
export class CenterRegisterCodeGuard implements CanActivate {
  constructor(
    private router: Router,
    private codeService: CenterRegisterCodeService
  ) {}

  canActivate(): boolean {
    if (this.codeService.isCodeValid()) {
      return true;
    }
    this.router.navigate(['/center-code']);
    return false;
  }
} 