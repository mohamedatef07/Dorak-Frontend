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
import {
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { AppointmentType } from '../../../../Enums/AppointmentType.enum';
import { ClientType } from '../../../../Enums/ClientType.enum';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
declare var bootstrap: any;

@Component({
  selector: 'app-CreateAppointment',
  templateUrl: './CreateAppointment.component.html',
  styleUrls: ['./CreateAppointment.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    DatePickerModule,
    FormsModule,
    FluidModule,
    AutoCompleteModule,
    ToastModule,
    TimeStringToDatePipe,
    ProgressSpinnerModule,
  ],
})
export class CreateAppointmentComponent implements OnInit {
  date1: Date | undefined;
  date2: Date | undefined;
  date3: Date | undefined;
  private ownerService = inject(OwnerService);
  private AuthService = inject(AuthService);
  private messageService = inject(MessageService);
  OperatorId: string = '';
  CenterId: number = 0;
  selectedShiftRecord: IShiftsTable | null = null;
  Records: IShiftsTable[] = [];
  filteredRecords: IShiftsTable[] = [];
  Services: IShiftServices[] = [];
  ProviderName: string[] = [];
  selectedService: IShiftServices | null = null;
  filteredServices: IShiftServices[] = [];
  filteredProviders: string[] = [];
  centerId = 1;
  CreateAppointmentForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  currentPage = 1;
  pageSize = 9;
  paginatedRecords: IShiftsTable[] = [];
  today: Date = new Date();
  loading: boolean = false;
  private pendingRequests: number = 0;

  constructor(private router: Router) {
    this.CreateAppointmentForm = new FormGroup({
      FirstName: new FormControl(''),
      LastName: new FormControl(''),
      ContactInfo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+?\d{10,15}$/),
      ]),
      AdditionalFees: new FormControl(0),
      AppointmentDate: new FormControl(null),
      ServiceId: new FormControl(null),
      ProviderId: new FormControl(null),
      Fees: new FormControl(0),
    });
  }

  ngOnInit() {
    this.loading = true;
    this.ownerService.getShiftsDetailsforbooking(this.centerId).subscribe({
      next: (res: ApiResponse<IShiftsTable[]>) => {
        this.OperatorId = this.AuthService.getUserId();
        this.CenterId = Number(this.AuthService.getCenterId());

        this.Records = [...res.Data];
        this.filteredRecords = [...this.Records];

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
        this.filteredProviders = [...this.ProviderName];

        const initialServiceId =
          this.CreateAppointmentForm.get('ServiceId')?.value;
        if (initialServiceId) {
          this.selectedService =
            this.Services.find((s) => s.ServiceId === initialServiceId) || null;
          this.updateFees();
        }

        this.CreateAppointmentForm.get('ProviderId')?.valueChanges.subscribe(
          () => this.filterRecords()
        );
        this.decrementLoader();
      },
      error: (err: any) => {
        this.decrementLoader();
        this.messageService.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }

  storeUniqueProviderNames() {
    // Normalize provider names to ensure uniqueness (trim and lowercase for comparison)
    this.ProviderName = Array.from(
      new Set(
        this.Records.map(
          (record) => record.ProviderName?.trim().toLowerCase() ?? ''
        )
      )
    )
      .map(
        (name) =>
          this.Records.find(
            (record) => record.ProviderName?.trim().toLowerCase() === name
          )?.ProviderName ?? ''
      )
      .filter((name) => name !== '');
  }

  formatDateToYMD(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  filterRecords() {
    const calendarDate: Date | null =
      this.CreateAppointmentForm.get('AppointmentDate')?.value;
    const formattedDate = this.formatDateToYMD(calendarDate);
    const serviceId = this.CreateAppointmentForm.get('ServiceId')?.value;
    const providerId = this.CreateAppointmentForm.get('ProviderId')?.value;

    this.filteredRecords = this.Records.reduce(
      (filtered: IShiftsTable[], record: IShiftsTable) => {
        const matchesDate =
          !formattedDate || record.ShiftDate === formattedDate;
        const matchesProvider =
          !providerId || record.ProviderName === providerId;

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
        return filtered;
      },
      []
    );
    this.updatePaginatedRecords();
  }

  clearFilters() {
    this.CreateAppointmentForm.patchValue({
      AppointmentDate: null,
      ServiceId: null,
      ProviderId: null,
      Fees: 0,
    });
    this.selectedService = null;
    this.filteredProviders = [...this.ProviderName];
    this.filteredRecords = [...this.Records];
    this.updatePaginatedRecords();
  }

  searchServices(event: any) {
    let query = event.query;
    this.filteredServices = this.Services.filter((service) =>
      service.ServiceName.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchProviders(event: any) {
    let query = event.query;
    this.filteredProviders = this.ProviderName.filter((provider) =>
      provider.toLowerCase().includes(query.toLowerCase())
    );
  }

  onServiceSelect(event: AutoCompleteSelectEvent) {
    const selected = event.value as IShiftServices;
    this.selectedService = selected;
    this.CreateAppointmentForm.get('ServiceId')?.setValue(selected.ServiceId);
    this.updateFees();
    this.filterRecords();
  }

  onClearService() {
    this.selectedService = null;
    this.CreateAppointmentForm.get('ServiceId')?.setValue(null);
    this.updateFees();
    this.filterRecords();
  }

  onProviderSelect(event: AutoCompleteSelectEvent) {
    const selected = event.value as string;
    this.CreateAppointmentForm.get('ProviderId')?.setValue(selected);
    this.filterRecords();
  }

  onClearProvider() {
    this.CreateAppointmentForm.get('ProviderId')?.setValue(null);
    this.filteredProviders = [...this.ProviderName];
    this.filterRecords();
  }

  updateFees() {
    const fees = this.selectedService ? this.selectedService.BasePrice : 0;
    this.CreateAppointmentForm.patchValue({ Fees: fees });
  }

  bookNow(record: IShiftsTable) {
    if (!this.CreateAppointmentForm.get('ContactInfo')?.valid) {
      this.messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: 'Invalid Contact Info',
        detail: 'Please enter a valid phone number (10-15 digits, optional +).',
      });
      return;
    }
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

    const modalEl = document.getElementById('confirmationModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      } else {
        modalEl.classList.remove('show');
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.style.display = 'none';
        this.closeModalFallback();
      }
    }
  }

  HandleSubmitForm() {
    debugger;

    if (!this.selectedShiftRecord) {
      this.errorMessage = 'Please select a shift before booking.';
      return;
    }

    if (this.CreateAppointmentForm.invalid) {
      this.CreateAppointmentForm.markAllAsTouched();
      return;
    }

    const raw = this.CreateAppointmentForm.getRawValue();
    // Determine AppointmentType and clientType based on selectedService
    let appointmentType = AppointmentType.Normal;
    let clientType = ClientType.Normal;
    if (raw.ServiceId) {
      // const serviceName = this.selectedService.ServiceName?.toLowerCase();
      if (raw.ServiceId === 3) {
        appointmentType = AppointmentType.Urgent;
        clientType = ClientType.Urgent;
      } else if (raw.ServiceId === 2) {
        appointmentType = AppointmentType.Normal; // as per your rule
        clientType = ClientType.Consultation;
      }
    }

    const appointmentData: ICreateAppointment = {
      FirstName: raw.FirstName,
      LastName: raw.LastName,
      ContactInfo: raw.ContactInfo,
      AppointmentDate: this.selectedShiftRecord.ShiftDate,
      AppointmentType: appointmentType,
      AppointmentStatus: 1,
      clientType: clientType,
      OperatorId: this.OperatorId,
      ProviderId: this.selectedShiftRecord.ProviderId,
      CenterId: this.CenterId,
      ShiftId: this.selectedShiftRecord.ShiftId,
      ServiceId: this.selectedShiftRecord.Services[0].ServiceId,
      Fees: this.selectedShiftRecord.Services[0].BasePrice,
      AdditionalFees: raw.AdditionalFees,
    };

    this.isSubmitting = true;
    this.ownerService.reserveAppointment(appointmentData).subscribe({
      next: (response: ApiResponse<ICreateAppointment>) => {
        this.isSubmitting = false;
        this.successMessage =
          response.Message || 'Appointment reserved successfully!';

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
        this.decrementLoader();
        this.router.navigate([
          '/owner/provider-live-queue',
          appointmentData.ShiftId,
        ]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Error during reservation.';
        this.decrementLoader();
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
    }, 100);
    this.errorMessage = null;
  }
  private decrementLoader() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }
}
