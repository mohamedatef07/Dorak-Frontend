import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { IResetPasswordRequest } from '../../types/IResetPasswordRequest';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    CardModule,
    PasswordModule
  ],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  email: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Read email and token from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      
      if (!this.email || !this.token) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Reset Link',
          detail: 'The reset password link is invalid or has expired.'
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  getPasswordStrength(password: string): { strength: string; color: string } {
    if (!password) return { strength: '', color: '' };
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const length = password.length >= 8;
    
    const score = [hasLower, hasUpper, hasNumber, hasSpecial, length].filter(Boolean).length;
    
    if (score < 3) return { strength: 'Weak', color: '#dc3545' };
    if (score < 5) return { strength: 'Medium', color: '#ffc107' };
    return { strength: 'Strong', color: '#28a745' };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    const request: IResetPasswordRequest = {
      email: this.email,
      token: this.token,
      newPassword: this.resetPasswordForm.get('newPassword')?.value
    };

    this.authService.resetPassword(request)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Password Reset Successful',
            detail: 'Your password has been reset successfully. You will be redirected to login.'
          });
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Reset password error:', error);
          
          let errorMessage = 'An error occurred while resetting your password.';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid reset token or email.';
          } else if (error.status === 404) {
            errorMessage = 'Reset link not found or has expired.';
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Reset Failed',
            detail: errorMessage
          });
        }
      });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.resetPasswordForm.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    if (field.errors['required']) return `${fieldName} is required.`;
    if (field.errors['minlength']) return `${fieldName} must be at least 8 characters.`;
    if (field.errors['pattern']) return `${fieldName} must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`;
    if (field.errors['passwordMismatch']) return 'Passwords do not match.';
    
    return '';
  }

  // Password requirement check methods
  hasMinLength(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && password.length >= 8;
  }

  hasLowercase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[a-z]/.test(password);
  }

  hasUppercase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[@$!%*?&]/.test(password);
  }
} 