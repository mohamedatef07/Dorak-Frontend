import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-personalSetting',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './personalSetting.component.html',
  styleUrls: ['./personalSetting.component.css'],
})
export class PersonalSettingComponent implements OnInit {
  messageServices = inject(MessageService);

  personalForm!: FormGroup;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this._providerService.getProviderProfile().subscribe({
      next: (res) => {
        console.log('Current profile:', res.Data);
        const nameParts = res.Data.FullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        this.imagePreview = environment.apiUrl + res.Data.Image;
        this.personalForm.patchValue({
          FirstName: firstName,
          LastName: lastName,
          email: res.Data.Email,
          phone: res.Data.Phone,
          birthDate: res.Data.BirthDate,
        });
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
    this.personalForm = this.fb.group({
      FirstName: [''],
      LastName: [''],
      email: ['', [Validators.email]],
      phone: [''],
      birthDate: [''],
      image: [null],
    });
  }

  onImageChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.personalForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.personalForm.valid) {
      const formData = new FormData();
      const firstName = this.personalForm.value.FirstName || '';
      const lastName = this.personalForm.value.LastName || '';

      formData.append('FirstName', firstName);
      formData.append('LastName', lastName);
      formData.append('Email', this.personalForm.value.email);
      formData.append('Phone', this.personalForm.value.phone);

      const birthDate = this.personalForm.value.birthDate;
      formData.append('BirthDate', birthDate);

      const image = this.personalForm.value.image;
      if (image instanceof File) {
        formData.append('Image', image);
      }
      this._providerService.updateProfile(formData).subscribe({
        next: (res) => {
          this.messageServices.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully!',
            life: 4000,
          });
        },
        error: (err) => {
          this.messageServices.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile. Please try again.',
            life: 4000,
          });
        },
      });
    }
  }

  onCancel() {
    this.personalForm.reset();
    this.imagePreview = null;
  }
}
