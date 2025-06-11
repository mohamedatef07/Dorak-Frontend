import { AppointmentStatusEnumValuePipe } from './../../../../pipes/AppointmentStatusEnumValue.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { IAppointment } from '../../models/IAppointment';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ClientTypeEnumValuePipe } from '../../../../pipes/ClientTypeEnumValue.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-last-appointment',
    imports:[ CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule,
    AppointmentStatusEnumValuePipe,
    ClientTypeEnumValuePipe,RouterLink],
  templateUrl: './last-appointment.component.html',
  styleUrls: ['./last-appointment.component.css']
})
export class LastAppointmentComponent implements OnInit {


   lastAppointments!:IAppointment;
   clientServices = inject(ClientService);
    cAuthServices = inject(AuthService);
  constructor() { }
    userid:string= '';
  ngOnInit() {
    this.userid= this.cAuthServices.getUserId();
    this.clientServices.getLastAppointment(this.userid).subscribe({
            next: (res) => {
              this.lastAppointments = res.Data;
              console.log(this.lastAppointments);

            },
            error: (err) => {
              console.error('Error while fetching Last appointment', err);
            },
          });

  }

}
