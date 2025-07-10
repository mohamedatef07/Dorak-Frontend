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
  ],
})
export class AddProviderComponent implements OnInit {
  model: IRegistrationViewModel = this.createEmptyModel();
  specializations: string[] = ['Cardiologist',
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
    'Emergency Medicine'];
  providerTypes: { value: ProviderType; label: string }[] = [
    { value: ProviderType.None, label: 'None' },
    { value: ProviderType.Temporary, label: 'Temporary' },
    { value: ProviderType.Permanent, label: 'Permanent' },
  ];
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
      this.imagePreview = null; // Clear preview if no file is selected
      this.snackBar.open('No file selected.', 'Close', { duration: 3000 });
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(this.selectedFile.type)) {
      this.errorMessage = 'Please select a valid image file (JPEG, PNG, or GIF).';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSizeInMB = 5;
    if (this.selectedFile.size > maxSizeInMB * 1024 * 1024) {
      this.errorMessage = `File size exceeds ${maxSizeInMB}MB limit.`;
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      this.selectedFile = null;
      this.imagePreview = null;
      return;
    }

    // Generate image preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.onerror = () => {
      this.errorMessage = 'Failed to read the image file.';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      this.selectedFile = null;
      this.imagePreview = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  validateForm(): boolean {
    const requiredFields = [
      'FirstName',
      'LastName',
      'Email',
      'PhoneNumber',
      'Specialization',
      'UserName',
      'Password',
      'ConfirmPassword',
      'Gender',
      'BirthDate',
      'ProviderType',
    ];
    const missingFields = requiredFields.filter((field) => {
      const value = this.model[field as keyof IRegistrationViewModel];
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
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

    // Create FormData object
    const formData = new FormData();
    // Append all model properties to FormData
    Object.keys(this.model).forEach((key) => {
      const value = this.model[key as keyof IRegistrationViewModel];
      if (value !== null && value !== undefined) {
        if (key === 'BirthDate' && value instanceof Date) {
          // Format Date as YYYY-MM-DD
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, '0');
          const day = String(value.getDate()).padStart(2, '0');
          formData.append(key, `${year}-${month}-${day}`);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append the image file if selected
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile, this.selectedFile.name);
    }

    this.apiService.addProviderAndAssignIt(formData).subscribe({
      next: (providerId: string) => {
        this.isSubmitting = false;
        this.snackBar.open('Provider added successfully!', 'Close', {
          duration: 3000,
        });
        if (providerId && typeof providerId === 'string' && providerId.trim() !== '') {
          this.router
            .navigate(['owner/manually-schedule', providerId])
            .then((success) => {
              if (!success) {
                this.router.navigate(['owner/add-provider']);
              }
            })
            .catch((err) => {
              console.error('Navigation error:', err);
              this.router.navigate(['owner/add-provider']);
            });
        } else {
          this.snackBar.open('Failed to proceed: Invalid provider ID', 'Close', {
            duration: 5000,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        const errorDetail = err.error?.errors
          ? Object.entries(err.error.errors)
              .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
              .join('; ')
          : err.error?.title || err.message;
        this.errorMessage = errorDetail || 'Failed to add provider.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        console.error('API error:', err);
      },
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { HttpErrorResponse } from '@angular/common/http';
// import { ApiService } from '../../../../services/api.service';
// import { IRegistrationViewModel } from '../../../../types/IRegistrationViewModel';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ProviderType } from '../../../../Enums/ProviderType.enum';
// import { FloatLabelModule } from 'primeng/floatlabel';
// import { InputTextModule } from 'primeng/inputtext';
// import { AutoCompleteModule } from 'primeng/autocomplete';
// import { ButtonModule } from 'primeng/button';

// @Component({
//   selector: 'app-add-provider',
//   templateUrl: './add-provider.component.html',
//   styleUrls: ['./add-provider.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     FloatLabelModule,
//     InputTextModule,
//     AutoCompleteModule,
//     ButtonModule
//   ],
// })
// export class AddProviderComponent implements OnInit {
//   model: IRegistrationViewModel = this.createEmptyModel();
//   specializations: string[] = ['Cardiology', 'Pediatrics', 'Orthopedics'];
//   specializationOptions: { label: string, value: string }[] = this.specializations.map(spec => ({ label: spec, value: spec }));
//   providerTypes: { value: ProviderType; label: string }[] = [
//     { value: ProviderType.None, label: 'None' },
//     { value: ProviderType.Temporary, label: 'Temporary' },
//     { value: ProviderType.Permanent, label: 'Permanent' },
//   ];
//   providerTypeOptions: { label: string, value: ProviderType }[] = this.providerTypes.map(type => ({ label: type.label, value: type.value }));
//   genderOptions: { label: string, value: string }[] = [
//     { label: 'Male', value: 'Male' },
//     { label: 'Female', value: 'Female' }
//   ];
//   filteredGenders: { label: string, value: string }[] = [];
//   minPasswordLength = 8;
//   minUsernameLength = 8;
//   minPhoneNumberLength = 8;
//   selectedFile: File | null = null;
//   imagePreview: string | null = null;
//   errorMessage: string = '';
//   isSubmitting = false;

//   constructor(
//     private apiService: ApiService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.filteredGenders = this.genderOptions;
//   }

//   private createEmptyModel(): IRegistrationViewModel {
//     return {
//       UserName: '',
//       Email: '',
//       PhoneNumber: '',
//       Password: 'Password123@',
//       ConfirmPassword: 'Password123@',
//       Role: 'Provider',
//       FirstName: '',
//       LastName: '',
//       Gender: 0,
//       BirthDate: '',
//       Street: '',
//       City: '',
//       Governorate: '',
//       Country: '',
//       Specialization: '',
//       Bio: 'No bio provided yet.',
//       ExperienceYears: null,
//       ProviderType: ProviderType.None,
//       LicenseNumber: '',
//       Availability: '',
//       EstimatedDuration: null,
//       Rate: null,
//     };
//   }

//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     this.selectedFile = input.files?.[0] || null;

//     if (!this.selectedFile) {
//       this.imagePreview = null;
//       this.snackBar.open('No file selected.', 'Close', { duration: 3000 });
//       return;
//     }

//     const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!validImageTypes.includes(this.selectedFile.type)) {
//       this.errorMessage = 'Please select a valid image file (JPEG, PNG, or GIF).';
//       this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
//       this.selectedFile = null;
//       this.imagePreview = null;
//       return;
//     }

//     const maxSizeInMB = 5;
//     if (this.selectedFile.size > maxSizeInMB * 1024 * 1024) {
//       this.errorMessage = `File size exceeds ${maxSizeInMB}MB limit.`;
//       this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
//       this.selectedFile = null;
//       this.imagePreview = null;
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e: ProgressEvent<FileReader>) => {
//       this.imagePreview = e.target?.result as string;
//     };
//     reader.onerror = () => {
//       this.errorMessage = 'Failed to read the image file.';
//       this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
//       this.selectedFile = null;
//       this.imagePreview = null;
//     };
//     reader.readAsDataURL(this.selectedFile);
//   }

//   validateForm(): boolean {
//     const requiredFields = [
//       'FirstName',
//       'LastName',
//       'Email',
//       'PhoneNumber',
//       'Specialization',
//       'UserName',
//       'Password',
//       'ConfirmPassword',
//       'Gender',
//       'BirthDate',
//       'ProviderType',
//     ];
//     const missingFields = requiredFields.filter((field) => {
//       const value = this.model[field as keyof IRegistrationViewModel];
//       return (
//         value === undefined ||
//         value === null ||
//         (typeof value === 'string' && value.trim() === '')
//       );
//     });

//     if (missingFields.length > 0) {
//       this.errorMessage = `Please fill all required fields: ${missingFields.join(', ')}.`;
//       return false;
//     }

//     if (this.model.Password !== this.model.ConfirmPassword) {
//       this.errorMessage = 'Password and Confirm Password do not match.';
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(this.model.Email)) {
//       this.errorMessage = 'Please enter a valid email address.';
//       return false;
//     }

//     if (this.model.UserName.length < this.minUsernameLength) {
//       this.errorMessage = `Username must be at least ${this.minUsernameLength} characters.`;
//       return false;
//     }

//     if (this.model.Password.length < this.minPasswordLength) {
//       this.errorMessage = `Password must be at least ${this.minPasswordLength} characters.`;
//       return false;
//     }

//     if (this.model.PhoneNumber.length < this.minPhoneNumberLength) {
//       this.errorMessage = `Please enter a valid phone number (minimum ${this.minPhoneNumberLength} digits).`;
//       return false;
//     }

//     return true;
//   }

//   onSubmit(): void {
//     this.errorMessage = '';

//     if (!this.validateForm()) {
//       this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
//       return;
//     }

//     this.isSubmitting = true;

//     const formData = new FormData();
//     Object.keys(this.model).forEach((key) => {
//       const value = this.model[key as keyof IRegistrationViewModel];
//       if (value !== null && value !== undefined) {
//         if (key === 'BirthDate' && value instanceof Date) {
//           const year = value.getFullYear();
//           const month = String(value.getMonth() + 1).padStart(2, '0');
//           const day = String(value.getDate()).padStart(2, '0');
//           formData.append(key, `${year}-${month}-${day}`);
//         } else {
//           formData.append(key, value.toString());
//         }
//       }
//     });

//     if (this.selectedFile) {
//       formData.append('Image', this.selectedFile, this.selectedFile.name);
//     }

//     this.apiService.addProviderAndAssignIt(formData).subscribe({
//       next: (providerId: string) => {
//         this.isSubmitting = false;
//         this.snackBar.open('Provider added successfully!', 'Close', {
//           duration: 3000,
//         });
//         if (providerId && typeof providerId === 'string' && providerId.trim() !== '') {
//           this.router
//             .navigate(['owner/manually-schedule', providerId])
//             .then((success) => {
//               if (!success) {
//                 this.router.navigate(['owner/add-provider']);
//               }
//             })
//             .catch((err) => {
//               console.error('Navigation error:', err);
//               this.router.navigate(['owner/add-provider']);
//             });
//         } else {
//           this.snackBar.open('Failed to proceed: Invalid provider ID', 'Close', {
//             duration: 5000,
//           });
//         }
//       },
//       error: (err: HttpErrorResponse) => {
//         this.isSubmitting = false;
//         const errorDetail = err.error?.errors
//           ? Object.entries(err.error.errors)
//               .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
//               .join('; ')
//           : err.error?.title || err.message;
//         this.errorMessage = errorDetail || 'Failed to add provider.';
//         this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
//         console.error('API error:', err);
//       },
//     });
//   }

//   filterGender(event: any) {
//     const query = event.query.toLowerCase();
//     this.filteredGenders = this.genderOptions.filter(option =>
//       option.label.toLowerCase().includes(query)
//     );
//   }

//   goBack() {
//     this.router.navigate(['../'], { relativeTo: this.router.routerState.root });
//   }
// }
