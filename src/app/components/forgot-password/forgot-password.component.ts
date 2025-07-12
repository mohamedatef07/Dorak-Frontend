import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { IForgotPasswordRequest } from '../../types/IForgotPasswordRequest';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
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
    DialogModule
  ],
  providers: [MessageService]
})
export class ForgotPasswordComponent {
  @Input() isDialog: boolean = false;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  forgotPasswordForm: FormGroup;
  isLoading = false;
  isEmailSent = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get clientAppUrl(): string {
    // Get the client app URL from environment configuration
    return environment.clientAppUrl;
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    const request: IForgotPasswordRequest = {
      email: this.forgotPasswordForm.get('email')?.value,
      clientAppUrl: this.clientAppUrl
    };

    this.authService.forgotPassword(request)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isEmailSent = true;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Email Sent',
            detail: 'Password reset instructions have been sent to your email address.'
          });

          // If it's a dialog, close it after a delay
          if (this.isDialog) {
            setTimeout(() => {
              this.closeDialog();
            }, 3000);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Forgot password error:', error);
          
          let errorMessage = 'An error occurred while processing your request.';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.status === 404) {
            errorMessage = 'Email address not found in our system.';
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Request Failed',
            detail: errorMessage
          });
        }
      });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm(): void {
    this.forgotPasswordForm.reset();
    this.isEmailSent = false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    if (field.errors['required']) return `${fieldName} is required.`;
    if (field.errors['email']) return 'Please enter a valid email address.';
    
    return '';
  }

  // Method to open as dialog from parent component
  openDialog(): void {
    this.visible = true;
    this.resetForm();
  }
} 