import { IAppointment } from './../../models/IAppointment';
import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.css']
})
export class UpcomingAppointmentsComponent implements OnInit {

   Appointments:IAppointment[]= [];
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
