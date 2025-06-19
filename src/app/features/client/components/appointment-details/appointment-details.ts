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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiResponse } from '../../../../types/ApiResponse';
import { __param } from 'tslib';

@Component({
  selector: 'app-appointment-details',
    imports:[ CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule,
    AppointmentStatusEnumValuePipe,
    ClientTypeEnumValuePipe,
    RouterLink
],
  templateUrl: './appointment-details.html',
  styleUrls: ['./appointment-details.css']
})
export class appointmentDetails implements OnInit {

 private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);

  appointmentId!: number;
  appointment!: IAppointment;

  ngOnInit(): void {

const param = this.route.snapshot.paramMap.get('appointmentId');
  if (param) {
    this.appointmentId = +param;

    this.clientService.getAppointmentById(this.appointmentId).subscribe({
  next: (res) => {
    console.log('Response from API:', res);
    this.appointment = res.Data;
  },
  error: (err) => {
    console.error(err);
  }
});

  }
}
}
