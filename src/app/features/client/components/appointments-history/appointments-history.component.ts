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

@Component({
  selector: 'app-appointments-history',
  templateUrl: './appointments-history.component.html',
  styleUrls: ['./appointments-history.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AvatarModule, RatingModule, FormsModule, RouterLink, TimeStringToDatePipe, AppointmentStatusEnumValuePipe],
})
export class AppointmentsHistoryComponent implements OnInit {
  clientService = inject(ClientService);
  authService = inject(AuthService);
  messageService = inject(MessageService);


  AppointmentsHistory: IClientAppointmentCard[] = [];
  userid: string = '';
  fullImagePath: string = `${environment.apiUrl}`;
  constructor() {}

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.clientService.getAppointmentsHistory(this.userid).subscribe({
      next: (res) => {
        this.AppointmentsHistory = [...res.Data];
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }
}
