import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OwnerService } from '../../services/owner.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { ICreateAppointment } from '../../models/ICreateAppointment';
import { IShiftsTable } from '../../models/IShiftsTable';
import { IShiftServices } from '../../models/IShiftServices';
import { AuthService } from '../../../../services/auth.service';
declare var bootstrap: any;
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-CreateAppointment',
  templateUrl: './CreateAppointment.component.html',
  styleUrls: ['./CreateAppointment.component.css'],
  imports: [ReactiveFormsModule, CommonModule,InputTextModule,FloatLabelModule],
  standalone: true,
})
export class CreateAppointmentComponent implements OnInit {
  private ownerService = inject(OwnerService);
  private AuthService = inject(AuthService);
  OperatorId: string = '';
  CenterId: number = 0;
  selectedShiftRecord: IShiftsTable | null = null;
  Records: IShiftsTable[] = [];
  filteredRecords: IShiftsTable[] = [];
  Services: IShiftServices[] = [];
  ProviderName: string[] = [];
  centerId = 1;
  CreateAppointmentForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  currentPage = 1;
  pageSize = 9;
  paginatedRecords: IShiftsTable[] = [];

  constructor() {
    this.CreateAppointmentForm = new FormGroup({
      FirstName: new FormControl(''),
      LastName: new FormControl(''),
      ContactInfo: new FormControl('', Validators.required),
      AdditionalFees: new FormControl(0),

      //For Filtering not for Creation
      AppointmentDate: new FormControl(''),
      ServiceId: new FormControl(''),
      ProviderId: new FormControl(''),
    });
  }

  ngOnInit() {
    this.ownerService.getShiftsDetailsforbooking(this.centerId).subscribe({
      next: (res: ApiResponse<IShiftsTable[]>) => {
        this.OperatorId = this.AuthService.getUserId();
        this.CenterId = Number(this.AuthService.getCenterId());
        console.log(this.OperatorId);
        console.log(this.CenterId);
        this.Records = [...res.Data];
        this.filteredRecords = [...this.Records];
        console.log(this.Records);
        console.log(this.filteredRecords);
        this.updatePaginatedRecords();
        this.Services = Array.from(
          new Map(
            this.Records.flatMap((record) => record.Services).map((service) => [
              service.ServiceId,
              service,
            ])
          ).values()
        );
        this.storeUniqueProviderNames();
      },
      error: (err: any) => {
        console.error('Error while fetching operators:', err);
      },
    });
  }

  storeUniqueProviderNames() {
    this.ProviderName = Array.from(
      new Set(this.Records.map((record) => record.ProviderName))
    );
  }

  filterRecords() {
    const date = this.CreateAppointmentForm.get('AppointmentDate')?.value;
    const serviceId = this.CreateAppointmentForm.get('ServiceId')?.value;
    const providerId = this.CreateAppointmentForm.get('ProviderId')?.value;

    console.log(date);
    console.log(serviceId);
    this.filteredRecords = this.Records.reduce(
      (filtered: IShiftsTable[], record: IShiftsTable) => {
        const matchesDate = !date || record.ShiftDate === date;
        const matchesProvider = !providerId || record.ProviderId == providerId;

        if (!serviceId) {
          if (matchesDate && matchesProvider) {
            filtered.push({ ...record });
          }
        } else {
          const matchedService = record.Services.find(
            (service) => service.ServiceId == serviceId
          );
          if (matchedService && matchesDate && matchesProvider) {
            filtered.push({
              ...record,
              Services: [matchedService],
            });
          }
        }

        console.log('this is filterd data:', this.filteredRecords);
        console.log('this is pagi data:', this.paginatedRecords);
        console.log('this is filtered', filtered);
        return filtered;
      },
      []
    );
    this.updatePaginatedRecords();
  }

  clearFilters() {
    this.CreateAppointmentForm.patchValue({
      AppointmentDate: '',
      ServiceId: '',
      ProviderId: '',
      Fees: '',
      ShiftId: '',
    });
    this.filteredRecords = [...this.Records];
    this.updatePaginatedRecords();
  }

  updateFees() {
    const serviceId = this.CreateAppointmentForm.get('ServiceId')?.value;
    const selectedService = this.Services.find(
      (service) => service.ServiceId == serviceId
    );
    const fees = selectedService ? selectedService.BasePrice : '';
    this.CreateAppointmentForm.patchValue({ Fees: fees });
  }

  bookNow(record: IShiftsTable) {
    this.selectedShiftRecord = record;
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  closeModalFallback() {
    document.body.classList.remove('modal-open');
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
  }

  confirmBooking() {
    this.HandleSubmitForm();

    const modalEl = document.getElementById('confirmationModal'); // not bookingModal
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    }
  }

  HandleSubmitForm() {
    console.log(this.selectedShiftRecord);

    if (!this.selectedShiftRecord) {
      this.errorMessage = 'Please select a shift before booking.';
      return;
    }

    if (this.CreateAppointmentForm.invalid) {
      this.CreateAppointmentForm.markAllAsTouched();
      return;
    }

    const raw = this.CreateAppointmentForm.getRawValue();

    const appointmentData: ICreateAppointment = {
      FirstName: raw.FirstName,
      LastName: raw.LastName,
      ContactInfo: raw.ContactInfo,
      AppointmentDate: this.selectedShiftRecord.ShiftDate,
      AppointmentType: 1,
      AppointmentStatus: 1,
      clientType: 1,
      OperatorId: this.OperatorId,
      ProviderId: this.selectedShiftRecord.ProviderId,
      CenterId: this.CenterId,
      ShiftId: this.selectedShiftRecord.ShiftId,
      ServiceId: this.selectedShiftRecord.Services[0].ServiceId,
      Fees: this.selectedShiftRecord.Services[0].BasePrice,
      AdditionalFees: raw.AdditionalFees,
    };

    console.log('appointmentData: ', appointmentData);

    this.isSubmitting = true;
    this.ownerService.reserveAppointment(appointmentData).subscribe({
      next: (response: ApiResponse<ICreateAppointment>) => {
        this.isSubmitting = false;
        this.successMessage =
          response.Message || 'Appointment reserved successfully!';
        console.log(response.Data);
        console.log(response.Message);

        const modalElement = document.getElementById('confirmationModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }

        setTimeout(() => {
          document.body.classList.remove('modal-open');

          const backdrops = document.getElementsByClassName('modal-backdrop');
          while (backdrops.length > 0) {
            backdrops[0].parentNode?.removeChild(backdrops[0]);
          }
        }, 500); // Delay slightly to let Bootstrap animation finish
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Error during reservation.';
        console.error('Error:', error);
        console.log(error.message);
      },
    });
  }

  updatePaginatedRecords() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.pageSize);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedRecords();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedRecords();
    }
  }

  getPaginationEndIndex(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredRecords.length
    );
  }

  cancelBooking() {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }

    setTimeout(() => {
      document.body.classList.remove('modal-open');

      const backdrops = document.getElementsByClassName('modal-backdrop');
      while (backdrops.length > 0) {
        backdrops[0].parentNode?.removeChild(backdrops[0]);
      }
    }, 500);
  }

}

