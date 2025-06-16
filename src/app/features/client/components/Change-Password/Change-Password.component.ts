import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Change-Password',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './Change-Password.component.html',
  styleUrls: ['./Change-Password.component.css']
})
export class ChangePasswordComponent implements OnInit {


personalForm!: FormGroup;
  successMessage: string | null = null;


  constructor(private fb: FormBuilder , private _clientService:ClientService) {}

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
 this._clientService.changePassword(formData).subscribe({
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
