import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { IClientAppointmentCard } from '../../models/IClientAppointmentCard';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppointmentStatusEnumValuePipe } from '../../../../pipes/AppointmentStatusEnumValue.pipe';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-appointments-history',
  templateUrl: './appointments-history.component.html',
  styleUrls: ['./appointments-history.component.css'],
  encapsulation: ViewEncapsulation.None,
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
})
export class AppointmentsHistoryComponent implements OnInit {
  clientService = inject(ClientService);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  loading: boolean = false;
  AppointmentsHistory: IClientAppointmentCard[] = [];
  userId: string = '';
  fullImagePath: string = `${environment.apiUrl}`;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  constructor() {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.loadAppointmentsHistory();
  }
  nextPage() {
    this.currentPage++;
    this.loadAppointmentsHistory();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAppointmentsHistory();
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
  loadAppointmentsHistory() {
    this.loading = true;
    this.clientService
      .getAppointmentsHistory(this.userId, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.AppointmentsHistory = [...res.Data];
          this.totalRecords = res.TotalRecords;
          this.currentPage = res.CurrentPage;
          this.pageSize = res.PageSize;
          this.totalPages = res.TotalPages;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            key: 'main-toast',
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
