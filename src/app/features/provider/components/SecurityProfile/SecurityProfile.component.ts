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
  selector: 'app-SecurityProfile',
  templateUrl: './SecurityProfile.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./SecurityProfile.component.css'],
})
export class SecurityProfileComponent implements OnInit {
  messageServices = inject(MessageService);

  personalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      OldPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.personalForm.valid) {
      const formData = new FormData();
      formData.append(
        'OldPassword',
        this.personalForm.get('OldPassword')?.value || ''
      );
      formData.append(
        'NewPassword',
        this.personalForm.get('NewPassword')?.value || ''
      );
      this._providerService.changePassword(formData).subscribe({
        next: (res) => {
          this.messageServices.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password updated successfully!',
            life: 4000,
          });
        },
        error: (err) => {
          this.messageServices.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update password. Please try again.',
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
