import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { S_ServicesService } from '../../services/S_Services.service';
import { IShiftServices } from '../../models/IShiftServices';
import { IAddProviderCenterService } from '../../models/IAddProviderCenterService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-service-to-provider-center',
  templateUrl: './assign-service-to-provider-center.component.html',
  styleUrls: ['./assign-service-to-provider-center.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AssignServiceToProviderCenterComponent implements OnInit {
  assignForm!: FormGroup;
  services: IShiftServices[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private sServices: S_ServicesService
  ) {}

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      ProviderId: ['', Validators.required],
      ServiceId: [null, Validators.required],
      CenterId: [null, Validators.required],
      Price: [null, [Validators.required, Validators.min(0)]],
      Priority: [null, [Validators.required, Validators.min(1)]]
    });
    this.fetchServices();
  }

  fetchServices() {
    this.sServices.GetAllServices().subscribe({
      next: (res) => {
        this.services = res.Data;
      },
      error: () => {
        this.errorMessage = 'Failed to load services.';
      }
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.assignForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    const formValue: IAddProviderCenterService = this.assignForm.value;
    this.sServices.AssignServiceToProviderCenterService(formValue).subscribe({
      next: () => {
        this.successMessage = 'Service assigned successfully!';
        this.assignForm.reset();
      },
      error: () => {
        this.errorMessage = 'Failed to assign service.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
