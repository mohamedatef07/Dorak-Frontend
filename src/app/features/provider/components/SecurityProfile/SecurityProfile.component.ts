import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-SecurityProfile',
  templateUrl: './SecurityProfile.component.html',
  imports:[ReactiveFormsModule,NgIf],
  styleUrls: ['./SecurityProfile.component.css']
})
export class SecurityProfileComponent implements OnInit {

personalForm!: FormGroup;
  successMessage: string | null = null;


  constructor(private fb: FormBuilder , private _providerService:ProviderService) {}

  ngOnInit(): void {
this.personalForm = this.fb.group({
 OldPassword: ['', Validators.required],
    NewPassword: ['', Validators.required],


});

  }

onSubmit(): void {
 if (this.personalForm.valid) {
  const formData = new FormData();
  formData.append('OldPassword', this.personalForm.get('OldPassword')?.value || '');
  formData.append('NewPassword', this.personalForm.get('NewPassword')?.value || '');
 this._providerService.changePassword(formData).subscribe({
      next: res => {
        console.log('Profile updated successfully!', res);

        this.successMessage = 'password updated successfully!';

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
