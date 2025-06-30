import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { IClientAppointmentCard } from '../../models/IClientAppointmentCard';
import { IAppointment } from '../../models/IAppointment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { routes } from '../../../../app.routes';
import { IDoctorCard } from '../../models/IDoctorCard';
import { environment } from '../../../../../environments/environment';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { IGeneralAppointmentStatistics } from '../../models/IGeneralAppointmentStatistics';
import { MessageService } from 'primeng/api';
import { AppointmentStatusEnumValuePipe } from '../../../../pipes/AppointmentStatusEnumValue.pipe';

@Component({
  selector: 'app-upcoming-appointments',
  imports: [
    CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule,
    RouterLink,
    TimeStringToDatePipe,
    AppointmentStatusEnumValuePipe
  ],
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UpcomingAppointmentsComponent implements OnInit {
  clientServices = inject(ClientService);
  cAuthServices = inject(AuthService);
  route = inject(ActivatedRoute);
  messageServices = inject(MessageService);

  doctors: IDoctorCard[] = [];
  Appointments: IClientAppointmentCard[] = [];
  appointmentStatistics!: IGeneralAppointmentStatistics;
  userid: string = '';
  fullImagePath: string = '';
  appointmentId!: number;
  appointment!: IAppointment;

  constructor() {}
  ngOnInit() {
    this.userid = this.cAuthServices.getUserId();
    this.clientServices.getUpcomingAppointments(this.userid).subscribe({
      next: (res) => {
        this.Appointments = res.Data;
        if (this.appointment.ProviderImage) {
          this.fullImagePath = `${environment.apiUrl}${this.appointment.ProviderImage}`;
          console.log(this.fullImagePath);
        }
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
    this.clientServices.getGeneralAppointmentStatistics().subscribe({
      next: (res) => {
        this.appointmentStatistics = res.Data;
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
    this.clientServices.getLastAppointment(this.userid).subscribe({
      next: (res) => {
        this.appointment = res.Data;
        let ProviderId = this.appointment.ProviderId;
        if (this.appointment.ProviderImage) {
          this.fullImagePath = `${environment.apiUrl}${this.appointment.ProviderImage}`;
        }
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });

    const param = this.route.snapshot.paramMap.get('appointmentId');
    if (param) {
      this.appointmentId = +param;
      this.clientServices.getAppointmentById(this.appointmentId).subscribe({
        next: (res) => {
          this.appointment = res.Data;
        },
        error: (err) => {
          this.messageServices.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'The server is experiencing an issue, Please try again soon.',
            life: 4000,
          });
        },
      });
    }
  }
}
