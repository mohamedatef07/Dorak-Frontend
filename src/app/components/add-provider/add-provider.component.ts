

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { IRegistrationViewModel } from '../../types/IRegistrationViewModel';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProviderType } from '../../types/Enums/ProviderType';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AddProviderComponent implements OnInit {
  model: IRegistrationViewModel = this.createEmptyModel();
  specializations: string[] = ['Cardiology', 'Pediatrics', 'Orthopedics'];
  providerTypes: { value: ProviderType; label: string }[] = [
    { value: ProviderType.None, label: 'None' },
    { value: ProviderType.Temporary, label: 'Temporary' },
    { value: ProviderType.Permanent, label: 'Permanent' }
  ];
  minPasswordLength = 8;
  minUsernameLength = 6;
  minPhoneNumberLength = 10;
  selectedFile: File | null = null;
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  private createEmptyModel(): IRegistrationViewModel {
    return {
      UserName: '',
      Email: '',
      PhoneNumber: '',
      Password: 'Password123@',
      ConfirmPassword: 'Password123@',
      Role: 'Provider',
      FirstName: '',
      LastName: '',
      Gender: 0,
      BirthDate: '',
      Street: '',
      City: '',
      Governorate: '',
      Country: '',
      Image: '',
      Specialization: '',
      Bio: '',
      ExperienceYears: null,
      ProviderType: ProviderType.None,
      LicenseNumber: '',

      Availability: '',
      EstimatedDuration: null,
      Rate: null
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;

    if (!this.selectedFile) {
      this.model.Image = '';

      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.model.Image = e.target?.result as string;
    };

    reader.onerror = () => {
      this.errorMessage = 'Failed to read the image file.';
      this.selectedFile = null;
      this.model.Image = '';

    };

    reader.readAsDataURL(this.selectedFile);
  }

  validateForm(): boolean {
    const requiredFields = ['FirstName', 'LastName', 'Email', 'PhoneNumber', 'Specialization', 'UserName', 'Password', 'ConfirmPassword', 'Gender', 'BirthDate', 'ProviderType'];
    const missingFields = requiredFields.filter(field => {
      const value = this.model[field as keyof IRegistrationViewModel];
      return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      this.errorMessage = `Please fill all required fields: ${missingFields.join(', ')}.`;
      return false;
    }

    if (this.model.Password !== this.model.ConfirmPassword) {
      this.errorMessage = 'Password and Confirm Password do not match.';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.model.Email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    if (this.model.UserName.length < this.minUsernameLength) {
      this.errorMessage = `Username must be at least ${this.minUsernameLength} characters.`;
      return false;
    }

    if (this.model.Password.length < this.minPasswordLength) {
      this.errorMessage = `Password must be at least ${this.minPasswordLength} characters.`;
      return false;
    }

    if (this.model.PhoneNumber.length < this.minPhoneNumberLength) {
      this.errorMessage = `Please enter a valid phone number (minimum ${this.minPhoneNumberLength} digits).`;
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.validateForm()) {
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;

    this.apiService.addProviderAndAssignIt(this.model).subscribe({
      next: (providerId: string) => {
        this.isSubmitting = false;
        this.snackBar.open('Provider added successfully!', 'Close', { duration: 3000 });
        console.log('API Response - providerId:', providerId);
        console.log('Type of providerId:', typeof providerId);
        console.log('Is providerId empty?', providerId === '');

        if (providerId && typeof providerId === 'string' && providerId.trim() !== '') {
          console.log('Navigating to schedule-options with providerId:', providerId);
          this.router.navigate(['/schedule-options', providerId]).then(success => {
            console.log('Navigation successful:', success);
            if (!success) {
              console.error('Navigation failed: Route not resolved');
              this.router.navigate(['/add-provider']);
            }
          }).catch(err => {
            console.error('Navigation error:', err);
            this.router.navigate(['/add-provider']);
          });
        } else {
          console.error('Invalid providerId received:', providerId);
          this.snackBar.open('Failed to proceed: Invalid provider ID', 'Close', { duration: 5000 });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        const errorDetail = err.error?.errors ? Object.entries(err.error.errors).map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`).join('; ') : err.error?.title || err.message;
        this.errorMessage = errorDetail || 'Failed to add provider.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        console.error('API error:', err);
      }
    });
  }
}
