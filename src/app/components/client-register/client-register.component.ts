import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../types/ApiResponse';
import { IClientRegisterRequest } from '../../types/IClientRegisterRequest';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './client-register.component.html',
  styleUrl: './client-register.component.css'
})
export class ClientRegisterComponent {
  clientRegisterForm: FormGroup;
  genders = ['Male', 'Female'];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.clientRegisterForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      userName: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        this.uppercaseValidator()
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.pattern(/^\+?[1-9]\d{5,14}$/)
      ]],
      firstName: [''],
      lastName: [''],
      gender: [''],
      birthDate: [''],
      street: [''],
      city: [''],
      governorate: [''],
      country: [''],
      image: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private uppercaseValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasUpperCase = /[A-Z]/.test(control.value);
      return !hasUpperCase && control.value ? { noUppercase: true } : null;
    };
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.clientRegisterForm.invalid) {
      this.markFormGroupTouched(this.clientRegisterForm);
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const formValue = this.clientRegisterForm.value;
    console.log('Form Value:', formValue);

    const registerData: IClientRegisterRequest = {
      UserName: formValue.userName?.trim(),
      Password: formValue.password,
      ConfirmPassword: formValue.confirmPassword,
      Role: 'Client',
      Email: formValue.email?.trim(),
      PhoneNumber: formValue.phoneNumber?.trim(),
      FirstName: formValue.firstName?.trim() || null,
      LastName: formValue.lastName?.trim() || null,
      Gender: formValue.gender || null,
      BirthDate: formValue.birthDate
        ? new Date(formValue.birthDate).toISOString().split('T')[0]
        : null,
      Street: formValue.street?.trim() || null,
      City: formValue.city?.trim() || null,
      Governorate: formValue.governorate?.trim() || null,
      Country: formValue.country?.trim() || null,
      Image: formValue.image || null
    };

    this.authService.register(registerData).subscribe({
      next: (response: ApiResponse<null>) => this.handleSuccess(response),
      error: (err: HttpErrorResponse) => this.handleError(err),
      complete: () => this.isLoading = false
    });
  }

  private handleSuccess(response: ApiResponse<null>): void {
    this.successMessage = response.Message || 'Registration successful! Please log in.';
    setTimeout(() => this.router.navigate(['/login']), 2000);
  }

  private handleError(err: HttpErrorResponse): void {
    this.isLoading = false;

    if (err.status === 400) {
      this.errorMessage = err.error?.Message || 'Invalid registration data';
      console.error('Validation Errors:', err.error?.Message);
      this.errorMessage = 'Unable to connect to server. Please check your connection.';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }

    console.error('Full Error Response:', err);
    console.error('Error Body:', err.error);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.clientRegisterForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  isFieldValid(controlName: string): boolean {
    const control = this.clientRegisterForm.get(controlName);
    return control ? control.valid && (control.dirty || control.touched) : false;
  }
}
