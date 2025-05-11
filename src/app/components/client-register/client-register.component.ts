import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css']
})

export class ClientRegisterComponent {
  clientRegisterForm: FormGroup;
  genders = ['none','Male', 'Female'];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userId: string = 'sample-user-id';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.clientRegisterForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      governorate: ['', Validators.required],
      country: ['', Validators.required],
      image: ['']
    });
  }

  onSubmit() {
    if (this.clientRegisterForm.valid) {
      const formValue = this.clientRegisterForm.value;
      const clientData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        gender: formValue.gender,
        birthDate: new Date(formValue.birthDate).toISOString().split('T')[0],
        street: formValue.street,
        city: formValue.city,
        governorate: formValue.governorate,
        country: formValue.country,
        image: formValue.image || null
      };

      this.authService.createClient(this.userId, clientData).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.successMessage = response.message;
            this.errorMessage = null;
            this.router.navigate(['/client-login']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Client registration failed';
          this.successMessage = null;
        }
      });
    }
  }
}
