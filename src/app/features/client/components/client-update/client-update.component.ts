import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-update',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent  {


  personalForm!: FormGroup;
  imagePreview: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadClientProfile();
  }

  initializeForm(): void {
    this.personalForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', Validators.required],
      Country: [''],
      BirthDate: [''],
      Street:[''],
      City:[''],
      Governmaent:['']
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

  loadClientProfile(): void {
    this._clientService.getClientProfile().subscribe({
      next: (res) => {
        const data = res.Data;
        const nameParts = data.FirstName?.trim().split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = data.LastName?.trim().split(' ') || [];

        this.imagePreview = environment.apiUrl + data.Image;

        this.personalForm.patchValue({
          FirstName: firstName,
          LastName: lastName,
          Email: data.Email,
          PhoneNumber: data.Phone,
          Country: data.Country || '',
          BirthDate: data.BirthDate || '',
          City:data.City,
          Governmaent:data.Governorate,
          Street:data.Street,
          

        });
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
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
 
    this._clientService.updateProfile(formData).subscribe({
      next: res => {
        console.log('Profile updated successfully!', res);

        this.successMessage = 'Profile updated successfully!';

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: err => {
        console.error('Update failed:', err);
      }
    });
  }
}



  onCancel() {
  this.personalForm.reset();
  this.imagePreview = null;
}

}
