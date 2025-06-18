import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ProfessionalInformation',
    imports:[ReactiveFormsModule,NgIf],

  templateUrl: './ProfessionalInformation.component.html',
  styleUrls: ['./ProfessionalInformation.component.css']
})
export class ProfessionalInformationComponent implements OnInit {

personalForm!: FormGroup;
  successMessage: string | null = null;


  constructor(private fb: FormBuilder , private _providerService:ProviderService) {}

  ngOnInit(): void {

     this._providerService.getProviderProfile().subscribe({
    next: (res) => {
      console.log('Current profile:', res.Data);



this.personalForm.patchValue({
  Specialization:res.Data.Specialization,
  ExperienceYears:res.Data.Experience,
  LicenseNumber:res.Data.MedicalLicenseNumber,
  Bio:res.Data.About

});

    },
    error: (err) => {
      console.error('Error loading profile', err);
    }
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
  formData.append('Specialization', this.personalForm.get('Specialization')!.value);

if (this.personalForm.get('LicenseNumber')?.value)
  formData.append('LicenseNumber', this.personalForm.get('LicenseNumber')!.value);

if (this.personalForm.get('Bio')?.value)
  formData.append('Bio', this.personalForm.get('Bio')!.value);

const experience = this.personalForm.get('ExperienceYears')?.value;
if (experience !== null && experience !== undefined && experience !== '')
  formData.append('ExperienceYears', experience.toString());




 this._providerService.updateProfileinformation(formData).subscribe({
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
}

}
