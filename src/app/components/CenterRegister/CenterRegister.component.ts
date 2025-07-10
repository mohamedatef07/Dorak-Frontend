import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { GenderType } from '../../Enums/GenderType.enum';

@Component({
  selector: 'app-CenterRegister',
  templateUrl: './CenterRegister.component.html',
  styleUrls: ['./CenterRegister.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    RouterModule,
  ],
  providers: [MessageService],
})
export class CenterRegisterComponent implements OnDestroy {
  // Stepper
  steps = [
    { label: 'User Details' },
    { label: 'Owner Details' },
    { label: 'Center Details' },
  ];
  activeStepIndex = 0;
  isLoading = false;
  showPassword = false;

  // Step 1: User Details
  user = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Admin', // hidden
  };

  // Step 2: Owner Details
  owner = {
    firstName: '',
    lastName: '',
    gender: '',
    image: null as File | null,
  };
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  // Step 3: Center Details
  center = {
    centerName: '',
    contactNumber: '',
    centerStreet: '',
    centerCity: '',
    centerGovernorate: '',
    centerCountry: '',
    centerEmail: '',
    websiteUrl: '',
    latitude: '',
    longitude: '',
    mapUrl: '',
  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  // Stepper navigation
  nextStep() {
    if (this.isCurrentStepValid() && this.activeStepIndex < 2) this.activeStepIndex++;
    else if (!this.isCurrentStepValid()) this.showValidationError();
  }
  previousStep() {
    if (this.activeStepIndex > 0) this.activeStepIndex--;
  }

  // Validation for each step
  isCurrentStepValid(): boolean {
    if (this.activeStepIndex === 0) {
      return (
        this.user.username.trim().length >= 8 &&
        this.user.email.trim().length >= 6 &&
        this.isValidEmail(this.user.email) &&
        this.user.phoneNumber.trim().length >= 8 &&
        this.user.password.trim().length >= 8 &&
        this.user.confirmPassword.trim().length >= 8 &&
        this.user.password === this.user.confirmPassword
      );
    } else if (this.activeStepIndex === 1) {
      return (
        this.owner.firstName.trim() !== '' &&
        this.owner.lastName.trim() !== '' &&
        this.owner.gender.trim() !== ''
      );
    } else if (this.activeStepIndex === 2) {
      return (
        this.center.centerName.trim() !== '' &&
        this.center.contactNumber.trim() !== '' &&
        this.center.centerStreet.trim() !== '' &&
        this.center.centerCity.trim() !== '' &&
        this.center.centerGovernorate.trim() !== '' &&
        this.center.centerCountry.trim() !== '' &&
        this.center.centerEmail.trim() !== '' &&
        this.isValidEmail(this.center.centerEmail) &&
        this.isValidDecimal(this.center.latitude) &&
        this.isValidDecimal(this.center.longitude)
      );
    }
    return false;
  }

  showValidationError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields correctly',
      life: 3000,
    });
  }

  // File input handler
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.owner.image = file;
  }

  // Password toggle
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add decimal validation helper
  public isValidDecimal(value: string): boolean {
    if (!value) return true; // allow empty for optional
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  // Submit all data
  onRegister() {
    if (!this.isCurrentStepValid()) {
      this.showValidationError();
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    // User fields
    formData.append('UserName', this.user.username);
    formData.append('Email', this.user.email);
    formData.append('PhoneNumber', this.user.phoneNumber);
    formData.append('Password', this.user.password);
    formData.append('ConfirmPassword', this.user.confirmPassword);
    formData.append('Role', this.user.role);
    // Owner fields
    formData.append('FirstName', this.owner.firstName);
    formData.append('LastName', this.owner.lastName);
    formData.append('Gender', this.owner.gender === 'Male' ? GenderType.Male.toString() : GenderType.Female.toString());
    if (this.owner.image) formData.append('Image', this.owner.image);
    // Center fields
    formData.append('CenterName', this.center.centerName);
    formData.append('ContactNumber', this.center.contactNumber);
    formData.append('CenterStreet', this.center.centerStreet);
    formData.append('CenterCity', this.center.centerCity);
    formData.append('CenterGovernorate', this.center.centerGovernorate);
    formData.append('CenterCountry', this.center.centerCountry);
    formData.append('CenterEmail', this.center.centerEmail);
    if (this.center.websiteUrl) formData.append('WebsiteURL', this.center.websiteUrl);
    if (this.center.latitude) formData.append('Latitude', this.center.latitude);
    if (this.center.longitude) formData.append('Longitude', this.center.longitude);
    if (this.center.mapUrl) formData.append('MapURL', this.center.mapUrl);

    // Debug: Log all FormData entries
    for (const pair of formData.entries()) {
      console.log(`[FormData] ${pair[0]}:`, pair[1]);
    }

    // Call register endpoint
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: response.Message || 'Center registered successfully!',
          life: 5000,
        });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err); // Log the error response
        let errorMessage = 'Registration failed. Please try again.';
        if (err.status === 400) {
          if (err.error?.Errors) {
            const validationErrors = err.error.Errors;
            const errorDetails = Object.keys(validationErrors)
              .map(key => validationErrors[key])
              .flat()
              .join(', ');
            errorMessage = `Validation errors: ${errorDetails}`;
          } else if (err.error?.Message) {
            errorMessage = err.error.Message;
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          }
        } else if (err.status === 409) {
          errorMessage = 'Username or email already exists.';
        } else if (err.status === 0 || err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: errorMessage,
          life: 5000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }
}
