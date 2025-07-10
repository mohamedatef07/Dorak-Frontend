import { AuthService } from './../../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { S_ServicesService } from '../../services/S_Services.service';
import { IShiftServices } from '../../models/IShiftServices';
import { IAddProviderCenterService } from '../../models/IAddProviderCenterService';
import { CommonModule } from '@angular/common';
import { CenterService } from '../../services/Center.service';
import { DropdownModule } from 'primeng/dropdown';
import { IProviderDropDown } from '../../models/IProviderDropDown';

@Component({
  selector: 'app-assign-service-to-provider-center',
  templateUrl: './assign-service-to-provider-center.component.html',
  styleUrls: ['./assign-service-to-provider-center.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule
  ]
})
export class AssignServiceToProviderCenterComponent implements OnInit {
  assignForm!: FormGroup;
  services: IShiftServices[] = [];
  providers: IProviderDropDown[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  centerId!: number;
  constructor(
    private fb: FormBuilder,
    private sServices: S_ServicesService,
    private AuthService: AuthService,
    private centerService: CenterService
  ) {}

  ngOnInit(): void {
    this.centerId = this.AuthService.getCenterId();
    this.assignForm = this.fb.group({
      ProviderId: [null, Validators.required],
      ServiceId: [null, Validators.required],
      CenterId: [this.centerId, Validators.required],
      Price: [null, [Validators.required, Validators.min(0)]],
      Priority: [null, [Validators.required, Validators.min(1)]]
    });
    this.fetchServices();
    this.fetchProviders();
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

  fetchProviders() {
    this.centerService.getProvidersDropDown(this.centerId).subscribe({
      next: (res) => {
        this.providers = res.Data;
      },
      error: () => {
        this.errorMessage = 'Failed to load providers.';
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
