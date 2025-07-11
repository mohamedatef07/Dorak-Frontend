import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ProfessionalInformation',
  imports: [ReactiveFormsModule],

  templateUrl: './ProfessionalInformation.component.html',
  styleUrls: ['./ProfessionalInformation.component.css'],
})
export class ProfessionalInformationComponent implements OnInit {
  messageServices = inject(MessageService);
  personalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this._providerService.getProviderProfile().subscribe({
      next: (res) => {
        this.personalForm.patchValue({
          Specialization: res.Data.Specialization,
          ExperienceYears: res.Data.Experience,
          LicenseNumber: res.Data.MedicalLicenseNumber,
          Bio: res.Data.About,
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
      Specialization: [''],
      ExperienceYears: [''],
      LicenseNumber: [''],
      Bio: [''],
    });
  }

  onSubmit(): void {
    if (this.personalForm.valid) {
      const formData = new FormData();

      if (this.personalForm.get('Specialization')?.value)
        formData.append(
          'Specialization',
          this.personalForm.get('Specialization')!.value
        );

      if (this.personalForm.get('LicenseNumber')?.value)
        formData.append(
          'LicenseNumber',
          this.personalForm.get('LicenseNumber')!.value
        );

      if (this.personalForm.get('Bio')?.value)
        formData.append('Bio', this.personalForm.get('Bio')!.value);

      const experience = this.personalForm.get('ExperienceYears')?.value;
      if (experience !== null && experience !== undefined && experience !== '')
        formData.append('ExperienceYears', experience.toString());

      this._providerService.updateProfileInformation(formData).subscribe({
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
  }
}
