import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent implements OnInit {
  personalForm!: FormGroup;
  imagePreview: string | null = null;
  currentImageName: string = '';
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _clientService: ClientService,
     private router: Router
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
  Street: [''],
  City: [''],
  Governorate: [''],
  image: ['']
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

        const firstName = data.FirstName || '';
        const lastName = data.LastName || '';

        this.currentImageName = data.Image || '';
        this.imagePreview = environment.apiUrl + data.Image;

      this.personalForm.patchValue({
      FirstName: data.FirstName,
      LastName: data.LastName,
      Email: data.Email,
      PhoneNumber: data.Phone,
      Country: data.Country,
      BirthDate: data.BirthDate,
      City: data.City,
       Governorate: data.Governorate,
      Street: data.Street
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

    formData.append('FirstName', this.personalForm.value.FirstName);
    formData.append('LastName', this.personalForm.value.LastName);
    formData.append('Email', this.personalForm.value.Email);
    formData.append('Phone', this.personalForm.value.PhoneNumber);
    formData.append('BirthDate', this.personalForm.value.BirthDate);
    formData.append('Street', this.personalForm.value.Street);
    formData.append('City', this.personalForm.value.City);
    formData.append('Governorate', this.personalForm.value.Governorate);
    formData.append('Country', this.personalForm.value.Country);

    const image = this.personalForm.value.image;
    if (image instanceof File) {
      formData.append('Image', image);
    } else if (this.currentImageName) {
      formData.append('Image', this.currentImageName);
    }

    this._clientService.updateProfile(formData).subscribe({
      next: (res) => {
        console.log('Profile updated successfully!', res);
        this.successMessage = 'Profile updated successfully!';

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  this.router.navigate(['/client/client-profile']);
});

        this.loadClientProfile();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }
}




}
