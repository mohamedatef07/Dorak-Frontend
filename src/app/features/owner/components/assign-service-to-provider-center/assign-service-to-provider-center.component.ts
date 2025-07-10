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
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-assign-service-to-provider-center',
  templateUrl: './assign-service-to-provider-center.component.html',
  styleUrls: ['./assign-service-to-provider-center.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    AutoCompleteModule
  ]
})
export class AssignServiceToProviderCenterComponent implements OnInit {
  assignForm!: FormGroup;
  services: IShiftServices[] = [];
  providers: IProviderDropDown[] = [];
  filteredProviders: IProviderDropDown[] = [];
  filteredServices: IShiftServices[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  centerId!: number;

  constructor(
    private fb: FormBuilder,
    private sServices: S_ServicesService,
    private authService: AuthService,
    private centerService: CenterService
  ) {}

  ngOnInit(): void {
    this.centerId = this.authService.getCenterId();
    this.assignForm = this.fb.group({
      ProviderId: [null, Validators.required],
      ServiceId: [null, Validators.required],
      CenterId: [this.centerId, Validators.required],
      Price: [null, [Validators.required, Validators.min(0)]],
      Priority: [1, [Validators.required, Validators.min(1)]]
    });
    this.fetchServices();
    this.fetchProviders();
  }

  fetchServices() {
    this.sServices.GetAllServices().subscribe({
      next: (res) => {
        this.services = res.Data;
        this.filteredServices = this.services;
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
        this.filteredProviders = this.providers;
        console.log("Providers:-",this.providers);
      },
      error: () => {
        this.errorMessage = 'Failed to load providers.';
      }
    });
  }

  filterProviders(event: any) {
    const query = event.query.toLowerCase();
    this.filteredProviders = this.providers.filter(p =>
      p.FullName.toLowerCase().includes(query)
    );
  }

  filterServices(event: any) {
    const query = event.query.toLowerCase();
    this.filteredServices = this.services.filter(s =>
      s.ServiceName.toLowerCase().includes(query)
    );
  }

  clearForm() {
    this.assignForm.reset({
      ProviderId: null,
      ServiceId: null,
      Price: null,
      CenterId: this.centerId,
      Priority: 1
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
    const formValue = this.assignForm.value;
    const payload = {
      ...formValue,
      ProviderId: formValue.ProviderId?.ProviderId,
      ServiceId: formValue.ServiceId?.ServiceId,
    };
    this.sServices.AssignServiceToProviderCenterService(payload).subscribe({
      next: () => {
        this.successMessage = 'Service assigned successfully!';
        this.assignForm.reset({
          ProviderId: null,
          ServiceId: null,
          Price: null,
          CenterId: this.centerId,
          Priority: 1
        });
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