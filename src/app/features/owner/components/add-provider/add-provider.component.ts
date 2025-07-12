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
import { ApiService } from '../../../../services/api.service';
import { IRegistrationViewModel } from '../../../../types/IRegistrationViewModel';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProviderType } from '../../../../Enums/ProviderType.enum';
import { GenderType } from '../../../../Enums/GenderType.enum';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

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
    MatNativeDateModule,
    FloatLabelModule,
    InputTextModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
  ],
})
export class AddProviderComponent implements OnInit {
  model: IRegistrationViewModel = this.createEmptyModel();
  specializations: string[] = [];
  specializationOptions = [] as { label: string; value: string }[];
  filteredSpecializations = [] as { label: string; value: string }[];

  providerTypes = [
    { value: ProviderType.None, label: 'None' },
    { value: ProviderType.Temporary, label: 'Temporary' },
    { value: ProviderType.Permanent, label: 'Permanent' },
  ];
  providerTypeOptions = [] as { label: string; value: ProviderType }[];
  filteredProviderTypes = [] as { label: string; value: ProviderType }[];

  genderOptions = [
    { label: 'Male', value: GenderType.Male },
    { label: 'Female', value: GenderType.Female },
  ];
  filteredGenders = [] as { label: string; value: GenderType }[];

  minPasswordLength = 8;
  minUsernameLength = 8;
  minPhoneNumberLength = 8;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.specializationOptions = this.specializations.map(spec => ({ label: spec, value: spec }));
    this.filteredSpecializations = [...this.specializationOptions];
    this.providerTypeOptions = this.providerTypes.map(type => ({ label: type.label, value: type.value }));
    this.filteredProviderTypes = [...this.providerTypeOptions];
    this.filteredGenders = [...this.genderOptions];
  }

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
      Gender: GenderType.Male,
      BirthDate: '',
      Street: '',
      City: '',
      Governorate: '',
      Country: '',
      Specialization: '',
      Bio: 'No bio provided yet.',
      ExperienceYears: null,
      ProviderType: ProviderType.None,
      LicenseNumber: '',
      Availability: '',
      EstimatedDuration: null,
      Rate: null,
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    if (!this.selectedFile) {
      this.imagePreview = null;
      this.snackBar.open('No file selected.', 'Close', { duration: 3000 });
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(this.selectedFile.type)) {
      this.errorMessage = 'Please select a valid image file (JPEG, PNG, or GIF).';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    const maxSizeInMB = 5;
    if (this.selectedFile.size > maxSizeInMB * 1024 * 1024) {
      this.errorMessage = `File size exceeds ${maxSizeInMB}MB limit.`;
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  validateForm(): boolean {
    const requiredFields = [
      'FirstName', 'LastName', 'Email', 'PhoneNumber', 'Specialization',
      'UserName', 'Password', 'ConfirmPassword', 'Gender', 'BirthDate', 'ProviderType',
    ];
    const missingFields = requiredFields.filter((field) => {
      const value = this.model[field as keyof IRegistrationViewModel];
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (field === 'ProviderType' && value === ProviderType.None)
      );
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
      this.errorMessage = `Phone number must be at least ${this.minPhoneNumberLength} digits.`;
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    Object.keys(this.model).forEach((key) => {
      const value = this.model[key as keyof IRegistrationViewModel];
      if (value !== null && value !== undefined) {
        if (key === 'BirthDate' && value instanceof Date) {
          const formatted = `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`;
          formData.append(key, formatted);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile, this.selectedFile.name);
    }

    this.apiService.addProviderAndAssignIt(formData).subscribe({
      next: (providerId: string) => {
        this.isSubmitting = false;
        this.snackBar.open('Provider added successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['owner/manually-schedule', providerId || 'owner/add-provider']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.errors
            ? Object.entries(err.error.errors)
                .map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`)
                .join('; ')
            : err.error?.title || err.message || 'Failed to add provider.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        console.error('API error:', err);
      },
    });
  }

  filterGender(event: AutoCompleteCompleteEvent): void {
    const query = event.query?.toLowerCase() || '';
    this.filteredGenders = this.genderOptions.filter(g => g.label.toLowerCase().includes(query));
  }

  filterSpecialization(event: AutoCompleteCompleteEvent): void {
    const query = event.query?.toLowerCase() || '';
    this.filteredSpecializations = this.specializationOptions.filter(s => s.label.toLowerCase().includes(query));
  }

  filterProviderType(event: AutoCompleteCompleteEvent): void {
    const query = event.query?.toLowerCase() || '';
    this.filteredProviderTypes = this.providerTypeOptions.filter(p => p.label.toLowerCase().includes(query));
  }

  goBack(): void {
    this.router.navigate(['owner/provider-management']);
  }
}
