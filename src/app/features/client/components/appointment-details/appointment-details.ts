import { AppointmentStatusEnumValuePipe } from '../../../../pipes/AppointmentStatusEnumValue.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { IAppointment } from '../../models/IAppointment';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ClientTypeEnumValuePipe } from '../../../../pipes/ClientTypeEnumValue.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse } from '../../../../types/ApiResponse';
import { __param } from 'tslib';
import { environment } from '../../../../../environments/environment';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { AppointmentStatus } from '../../../../Enums/AppointmentStatus.enum';
import { ICheckoutRequest } from '../../models/ICheckoutRequest';
import { IDoctorMainInfo } from '../../models/IDoctorMainInfo';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-appointment-details',
  imports: [
    CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule,
    AppointmentStatusEnumValuePipe,
    ClientTypeEnumValuePipe,
    RouterLink,
    TimeStringToDatePipe,
  ],
  templateUrl: './appointment-details.html',
  styleUrls: ['./appointment-details.css'],
})
export class appointmentDetails implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private messageServices = inject(MessageService);
  appointmentId!: number;
  appointment!: IAppointment;
  fullImagePath: string = '';
  checkoutRequest: ICheckoutRequest = {
    Amount: 0,
    AppointmentId: 0,
    ClientId: '',
    StripeToken: '',
  };

  doctorMainInfo: IDoctorMainInfo = {
    FullName: '',
    Specialization: '',
    Bio: '',
    Rate: 0,
    Image: '',
  };

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot.paramMap.get('appointmentId');
    if (param) {
      this.appointmentId = +param;

      this.clientService.getAppointmentById(this.appointmentId).subscribe({
        next: (res) => {
          this.appointment = res.Data;
          if (
            this.appointment.AppointmentStatus === AppointmentStatus.Pending
          ) {
            this.checkoutRequest = {
              AppointmentId: this.appointment.appointmentId,
              ClientId: this.appointment.UserId,
              StripeToken: 'tok_visa',
              Amount: this.appointment.Fees,
            };
          }
          if (this.appointment.ProviderImage) {
            this.fullImagePath = `${environment.apiUrl}${this.appointment.ProviderImage}`;
          }
          this.doctorMainInfo = {
            FullName: this.appointment.ProviderName,
            Specialization: this.appointment.Specialization,
            Bio: '',
            Rate: this.appointment.ProviderRate,
            Image: this.appointment.ProviderImage,
          };
        },

        error: (err) => {
          console.error(err);
        },
      });
    }
  }
  public clientCancelAppointment(appointmentId: number): void {
    this.clientService.cancelAppointment(appointmentId).subscribe({
      next: (res) => {
        console.log(res);
        this.messageServices.add({
          severity: 'info',
          summary: 'info',
          detail: 'Appointment cancelled successfully',
          life: 4000,
        });
        this.router.navigate(['/client/client-upcoming-appointments']);
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to cancel appointment. Please try again later',
          life: 4000,
        });
      },
    });
  }
}
