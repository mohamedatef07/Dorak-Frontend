import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CenterRegisterCodeService } from '../../services/center-register-code.service';

@Component({
  selector: 'app-center-register-code',
  templateUrl: './CenterRegisterCode.component.html',
  styleUrls: ['./CenterRegisterCode.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CenterRegisterCodeComponent {
  code: string = '';
  error: string = '';
  readonly validCode = 'Dorak2025'; 

  constructor(
    private router: Router,
    private codeService: CenterRegisterCodeService
  ) {}

  submitCode() {
    if (this.code === this.validCode) {
      this.codeService.setCodeValid(true);
      this.router.navigate(['/center-register']);
    } else {
      this.error = 'Invalid code. Please try again.';
    }
  }
} 