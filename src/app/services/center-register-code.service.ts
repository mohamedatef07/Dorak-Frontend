import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CenterRegisterCodeService {
  private codeValid = false;

  setCodeValid(valid: boolean) {
    this.codeValid = valid;
  }

  isCodeValid(): boolean {
    return this.codeValid;
  }
} 