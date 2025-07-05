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
  image: string;
  
  // Provider-specific fields
  specialization: string;
  bio: string;
  experienceYears: number;
  licenseNumber: string;
  providerTitle: string;
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
    image: '',
    
    // Provider-specific fields
    specialization: '',
    bio: '',
    experienceYears: 0,
    licenseNumber: '',
    providerTitle: '',
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
    private messageService: MessageService
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
      this.registrationData.email.trim() !== '' &&
      this.registrationData.phoneNumber.trim() !== '' &&
      this.registrationData.password.trim() !== '' &&
      this.registrationData.confirmPassword.trim() !== '' &&
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
          this.registrationData.providerTitle.trim() !== '' &&
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

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'Your account has been created successfully!',
        life: 3000,
      });

      // Navigate to login after successful registration
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 2000);
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
}
