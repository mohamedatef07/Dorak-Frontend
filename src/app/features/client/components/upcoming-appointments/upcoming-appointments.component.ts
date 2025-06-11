import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { IClientProfileAppointment } from '../../models/IClientProfileAppointment';


@Component({
  selector: 'app-upcoming-appointments',
  imports:[ CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule],
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.css']
})
export class UpcomingAppointmentsComponent implements OnInit {

   Appointments:IClientProfileAppointment[]= [];
   clientServices = inject(ClientService);
    cAuthServices = inject(AuthService);
  constructor() { }
    userid:string= '';
  ngOnInit() {
    this.userid= this.cAuthServices.getUserId();
    this.clientServices.getUpcomingAppointments(this.userid).subscribe({
            next: (res) => {
              this.Appointments = res.Data;
              console.log(this.Appointments);

            },
            error: (err) => {
              console.error('Error while fetching upcomming appointment', err);
            },
          });
  }

}
