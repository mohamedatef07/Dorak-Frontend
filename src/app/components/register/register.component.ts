import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { GenderType } from '../../Enums/GenderType.enum';
import { DoctorTitle } from '../../Enums/DoctorTitle.enum';

interface RegistrationData {
  // First page data
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  
  // Common fields for step 2
  firstName: string;
  lastName: string;
  gender: string;
  street: string;
  city: string;
  governorate: string;
  country: string;
  birthDate: Date;
  image: File | null;
  
  // Provider-specific fields
  specialization: string;
  bio: string;
  experienceYears: number;
  licenseNumber: string;
  providerTitle: DoctorTitle | undefined;
  providerType: number;
  estimatedDuration: number;
  rate: number;
}

interface RoleOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextarea,
    ToastModule,
    RouterModule,
  ],
})
export class RegisterComponent {
  activeStepIndex: number = 0;
  isLoading: boolean = false;
  showPassword: boolean = false;

  DoctorTitle = DoctorTitle;
  doctorTitles = Object.values(DoctorTitle).filter(value => typeof value === 'number' && value !== DoctorTitle.None);

  registrationData: RegistrationData = {
    // First page data
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    
    // Common fields for step 2
    firstName: '',
    lastName: '',
    gender: '',
    street: '',
    city: '',
    governorate: '',
    country: '',
    birthDate: new Date(),
    image: null,
    
    // Provider-specific fields
    specialization: '',
    bio: '',
    experienceYears: 0,
    licenseNumber: '',
    providerTitle: undefined as any,
    providerType: 2,
    estimatedDuration: 0,
    rate: 0,
  };

  selectedSpecialization: string = '';

  specializations = [
    'Cardiologist',
    'Dermatologist',
    'Endocrinologist',
    'Gastroenterologist',
    'General Practitioner',
    'Geriatrician',
    'Hematologist',
    'Infectious Disease Specialist',
    'Internal Medicine',
    'Nephrologist',
    'Neurologist',
    'Obstetrician/Gynecologist (OB/GYN)',
    'Oncologist',
    'Ophthalmologist',
    'Orthopedic Surgeon',
    'Otolaryngologist (ENT)',
    'Pediatrician',
    'Plastic Surgeon',
    'Psychiatrist',
    'Pulmonologist',
    'Radiologist',
    'Rheumatologist',
    'Surgeon',
    'Urologist',
    'Allergist/Immunologist',
    'Anesthesiologist',
    'Pathologist',
    'Sports Medicine Specialist',
    'Family Medicine',
    'Occupational Medicine',
    'Emergency Medicine',
    'Custom'
  ];

  showCustomSpecialization: boolean = false;

  roles: RoleOption[] = [
    { name: 'Client', value: 'Client' },
    { name: 'Provider', value: 'Provider' },
  ];

  steps = [
    {
      label: 'Basic Information',
      command: () => {
        this.activeStepIndex = 0;
      },
    },
    {
      label: 'Role Details',
      command: () => {
        this.activeStepIndex = 1;
      },
    },
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      if (this.activeStepIndex < this.steps.length - 1) {
        this.activeStepIndex++;
      }
    } else {
      this.showValidationError();
    }
  }

  previousStep(): void {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex--;
    }
  }

  isCurrentStepValid(): boolean {
    if (this.activeStepIndex === 0) {
      return this.isStep1Valid();
    } else if (this.activeStepIndex === 1) {
      return this.isStep2Valid();
    }
    return false;
  }

  isStep1Valid(): boolean {
    return (
      this.registrationData.username.trim() !== '' &&
      this.registrationData.username.length >= 8 &&
      this.registrationData.email.trim() !== '' &&
      this.registrationData.email.length >= 6 &&
      this.isValidEmail(this.registrationData.email) &&
      this.registrationData.phoneNumber.trim() !== '' &&
      this.registrationData.phoneNumber.length >= 8 &&
      this.registrationData.password.trim() !== '' &&
      this.registrationData.password.length >= 8 &&
      this.registrationData.confirmPassword.trim() !== '' &&
      this.registrationData.confirmPassword.length >= 8 &&
      this.registrationData.password === this.registrationData.confirmPassword &&
      this.registrationData.role !== ''
    );
  }

  isStep2Valid(): boolean {
    if (!this.registrationData.role) return false;

    // Common validation for all roles
    const commonFieldsValid = (
      this.registrationData.firstName.trim() !== '' &&
      this.registrationData.lastName.trim() !== '' &&
      this.registrationData.gender.trim() !== '' &&
      this.registrationData.street.trim() !== '' &&
      this.registrationData.city.trim() !== '' &&
      this.registrationData.governorate.trim() !== '' &&
      this.registrationData.country.trim() !== '' &&
      this.registrationData.birthDate !== null
    );

    if (!commonFieldsValid) return false;

    switch (this.registrationData.role) {
      case 'Client':
        return true; // Only common fields required for client
      case 'Provider':
        return (
          this.registrationData.specialization.trim() !== '' &&
          this.registrationData.bio.trim() !== '' &&
          this.registrationData.experienceYears > 0 &&
          this.registrationData.licenseNumber.trim() !== '' &&
          this.registrationData.providerTitle !== undefined &&
          this.registrationData.estimatedDuration > 0
        );
      default:
        return false;
    }
  }

  showValidationError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields correctly',
      life: 3000,
    });
  }

  onRegister(): void {
    if (!this.isCurrentStepValid()) {
      this.showValidationError();
      return;
    }

    this.isLoading = true;

    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all the registration data to FormData
    formData.append('UserName', this.registrationData.username);
    formData.append('Email', this.registrationData.email);
    formData.append('PhoneNumber', this.registrationData.phoneNumber);
    formData.append('Password', this.registrationData.password);
    formData.append('ConfirmPassword', this.registrationData.confirmPassword);
    formData.append('Role', this.registrationData.role);
    
    // Common fields
    formData.append('FirstName', this.registrationData.firstName);
    formData.append('LastName', this.registrationData.lastName);
    formData.append('Gender', this.registrationData.gender === 'Male' ? GenderType.Male.toString() : GenderType.Female.toString());
    
    // Format date for C# DateOnly
    if (this.registrationData.birthDate) {
      const formattedDate = this.formatDateForAPI(this.registrationData.birthDate);
      formData.append('BirthDate', formattedDate);
    }
    
    // Address fields
    formData.append('Street', this.registrationData.street);
    formData.append('City', this.registrationData.city);
    formData.append('Governorate', this.registrationData.governorate);
    formData.append('Country', this.registrationData.country);
    
    // Image file
    if (this.registrationData.image) {
      formData.append('Image', this.registrationData.image);
    }
    
    // Provider-specific fields (only if role is Provider)
    if (this.registrationData.role === 'Provider') {
      formData.append('Specialization', this.registrationData.specialization);
      formData.append('Bio', this.registrationData.bio);
      formData.append('ExperienceYears', this.registrationData.experienceYears.toString());
      formData.append('ProviderType', this.registrationData.providerType.toString());
      formData.append('LicenseNumber', this.registrationData.licenseNumber);
      formData.append('ProviderTitle', this.registrationData.providerTitle?.toString() || '');
      formData.append('EstimatedDuration', this.registrationData.estimatedDuration.toString());
      formData.append('Rate', this.registrationData.rate.toString());
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: response.Message || 'Your account has been created successfully!',
          life: 5000,
        });

        // Navigate to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        
        // Handle different types of errors
        let errorMessage = 'Registration failed. Please try again.';
        
        if (err.status === 400) {
          if (err.error?.Errors) {
            // Handle validation errors from the API
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
          } else {
            errorMessage = 'Please check your input and try again.';
          }
        } else if (err.status === 409) {
          errorMessage = 'Username or email already exists. Please choose different credentials.';
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

  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSpecializationChange(): void {
    if (this.selectedSpecialization === 'Custom') {
      this.showCustomSpecialization = true;
      this.registrationData.specialization = '';
    } else {
      this.showCustomSpecialization = false;
      this.registrationData.specialization = this.selectedSpecialization;
    }
  }

  onCustomSpecializationInput(): void {
    // When user types in custom input, keep the dropdown showing "Custom"
    this.selectedSpecialization = 'Custom';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.registrationData.image = file;
    }
  }

  ngOnDestroy(): void {
    // Cleanup to prevent memory leaks and calendar errors
    this.isLoading = false;
  }
}
