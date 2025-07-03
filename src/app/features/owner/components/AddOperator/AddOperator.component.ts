import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../../types/ApiResponse';
import { OwnerService } from '../../services/owner.service';
import { CommonModule } from '@angular/common';
import { IAddOperator } from '../../models/IAddOperator';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-add-operator',
  templateUrl: './AddOperator.component.html',
  styleUrls: ['./AddOperator.component.css'],
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, FloatLabelModule, DropdownModule, ButtonModule, ToastModule, AutoCompleteModule],
  providers: [MessageService]
})
export class AddOperatorComponent implements OnInit {
  private ownerService = inject(OwnerService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  AddOperatorForm: FormGroup;
  genders = ['Male', 'Female'];
  genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 }
  ];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  filteredGenders: { label: string, value: number }[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.AddOperatorForm = new FormGroup({
      UserName: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
      ConfirmPassword: new FormControl('', Validators.required),
      Role: new FormControl('Operator'),
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      // image: [''],
      Gender: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Set initial gender if present
    const genderValue = this.AddOperatorForm.get('Gender')?.value;
    if (genderValue) {
      this.AddOperatorForm.get('Gender')?.setValue(this.genderOptions.find(g => g.value === genderValue) || null);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB
        this.messageService.add({
          severity: 'error',
          summary: 'Image Too Large',
          detail: 'Please select an image smaller than 2MB.'
        });
        return;
      }
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  HandleSubmitForm() {
    if (this.AddOperatorForm.invalid) {
      this.AddOperatorForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Please fill in all required fields correctly.'
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const operatorData = new FormData();
    Object.entries(this.AddOperatorForm.value).forEach(([key, value]) => {
      operatorData.append(key, value as string);
    });
    const centerId = this.authService.getCenterId();
    if (centerId) {
      operatorData.append('CenterId', String(centerId));
    }
    if (this.selectedImageFile) {
      operatorData.append('image', this.selectedImageFile);
    }

    this.ownerService.addOperatorByCenterId(operatorData).subscribe({
      next: (response: ApiResponse<IAddOperator>) => {
        this.isSubmitting = false;
        if (response.Status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Operator added successfully!'
          });
          this.router.navigate(['/owner/manage-operators']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.Message || 'Failed to add operator.'
          });
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'An error occurred while adding the operator.'
        });
        console.error('Error:', error);
      }
    });
  }

  filterGender(event: any) {
    const query = event.query.toLowerCase();
    this.filteredGenders = this.genderOptions.filter(option =>
      option.label.toLowerCase().includes(query)
    );
  }

}
