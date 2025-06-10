import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerService } from '../../services/owner.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { ICreateAppointment } from '../../../../types/ICreateAppointment';

@Component({
  selector: 'app-CreateAppointment',
  templateUrl: './CreateAppointment.component.html',
  styleUrls: ['./CreateAppointment.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateAppointmentComponent implements OnInit {
  private ownerService = inject(OwnerService);
  CreateAppointmentForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  constructor() {
    this.CreateAppointmentForm = new FormGroup({
      AppointmentDate: new FormControl('', Validators.required),
      AppointmentStatus: new FormControl('', Validators.required),
      AppointmentType: new FormControl('', Validators.required),
      clientType: new FormControl('', Validators.required),
      Fees: new FormControl('', Validators.required),
      AdditionalFees: new FormControl(''),
      OperatorId: new FormControl('bff98ebb-8670-4939-afb8-f96270bdcd33', Validators.required),
      ProviderId: new FormControl('c86fff59-eac1-4a27-a347-db3f46446a30', Validators.required),
      CenterId: new FormControl('1', Validators.required),
      ServiceId: new FormControl('1', Validators.required),
      ShiftId: new FormControl('1', Validators.required),
      ContactInfo: new FormControl('', Validators.required),
      FirstName: new FormControl(''),
      LastName: new FormControl('')
    })

  }

  ngOnInit() {
  }

  HandleSubmitForm() {
    console.log(this.CreateAppointmentForm);
    if (this.CreateAppointmentForm.invalid) {
      this.CreateAppointmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const raw = this.CreateAppointmentForm.value;

    const appointmentData = {
      AppointmentDate: raw.AppointmentDate, // Already a proper string "YYYY-MM-DD"
      AppointmentStatus: +raw.AppointmentStatus, // 👈 cast to number
      AppointmentType: +raw.AppointmentType,
      clientType: +raw.clientType,             // 👈 cast to number and use lowercase key
      Fees: +raw.Fees,
      AdditionalFees: raw.AdditionalFees ? +raw.AdditionalFees : 0,
      OperatorId: raw.OperatorId,
      ProviderId: raw.ProviderId,
      CenterId: +raw.CenterId,
      ServiceId: +raw.ServiceId,
      ShiftId: +raw.ShiftId,
      ContactInfo: raw.ContactInfo,
      FirstName: raw.FirstName,
      LastName: raw.LastName,
    };
    console.log(appointmentData);

    this.ownerService.reserveAppointment(appointmentData).subscribe({
      next: (response: ApiResponse<ICreateAppointment>) => {
        this.isSubmitting = false;
        if (response.Status == 200) {
          this.successMessage = response.Message || 'Appointment added successfully!';
        } else {
          this.errorMessage = response.Message || 'Failed to add operator.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'An error occurred while adding the operator.';
        console.error('Error:', error);
      }
    });


  }

}
