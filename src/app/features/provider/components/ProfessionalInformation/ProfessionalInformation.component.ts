import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-ProfessionalInformation',
    imports:[ReactiveFormsModule],

  templateUrl: './ProfessionalInformation.component.html',
  styleUrls: ['./ProfessionalInformation.component.css']
})
export class ProfessionalInformationComponent implements OnInit {

personalForm!: FormGroup;

  constructor(private fb: FormBuilder , private _providerService:ProviderService) {}

  ngOnInit(): void {
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
      next: res => console.log('Profile updated successfully!', res),
      error: err => console.error('Update failed:', err)
    });
  } else {
    console.warn(' Form is invalid');
    this.personalForm.markAllAsTouched();
  }
}




  onCancel() {
  this.personalForm.reset();
}

}
