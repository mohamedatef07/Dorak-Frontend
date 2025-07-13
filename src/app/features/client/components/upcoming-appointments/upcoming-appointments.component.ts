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
import { IDoctorCard } from '../../models/iDoctorcard';
import { environment } from '../../../../../environments/environment';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { IGeneralAppointmentStatistics } from '../../models/IGeneralAppointmentStatistics';
import { MessageService } from 'primeng/api';
import { AppointmentStatusEnumValuePipe } from '../../../../pipes/AppointmentStatusEnumValue.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-upcoming-appointments',
  imports: [
    CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule,
    RouterLink,
    TimeStringToDatePipe,
    AppointmentStatusEnumValuePipe,
    ProgressSpinnerModule,
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
  userid: string = this.cAuthServices.getUserId();
  fullImagePath: string = `${environment.apiUrl}`;
  appointmentId!: number;
  appointment!: IAppointment;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  private pendingRequests: number = 0;
  constructor() {}
  ngOnInit() {
    this.loading = true;
    this.pendingRequests = 2;
    this.loadUpcomingAppointments();
    this.clientServices.getGeneralAppointmentStatistics().subscribe({
      next: (res) => {
        this.appointmentStatistics = res.Data;
        this.decrementLoader();
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
        this.decrementLoader();
      },
    });
    this.clientServices.getLastAppointment(this.userid).subscribe({
      next: (res) => {
        this.appointment = res.Data;
        let ProviderId = this.appointment.ProviderId;
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
  nextPage() {
    this.currentPage++;
    this.loadUpcomingAppointments();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUpcomingAppointments();
    }
  }

  get canGoNext(): boolean {
    return this.currentPage * this.pageSize < this.totalRecords;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }
  loadUpcomingAppointments() {
    this.clientServices.getUpcomingAppointments(this.userid, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.Appointments = [...res.Data];
        this.totalRecords = res.TotalRecords;
        this.currentPage = res.CurrentPage;
        this.pageSize = res.PageSize;
        this.totalPages = res.TotalPages;
        this.decrementLoader();
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
        this.decrementLoader();
      },
    });
  }
    private decrementLoader() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }
}
