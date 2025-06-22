import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { IClientProfileAppointment } from '../../models/IClientProfileAppointment';
import { IAppointment } from '../../models/IAppointment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { routes } from '../../../../app.routes';
import { IDoctorCard } from '../../models/IDoctorCard';


@Component({
  selector: 'app-upcoming-appointments',
  imports:[ CommonModule,
    AvatarModule,
    RatingModule,
    FormsModule,
  RouterLink],
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.css']
})
export class UpcomingAppointmentsComponent implements OnInit {

  doctors: IDoctorCard[] = [];
   Appointments:IClientProfileAppointment[]= [];
   clientServices = inject(ClientService);
    cAuthServices = inject(AuthService);
  constructor() { }
    userid:string= '';
      private clientService = inject(ClientService);
      private route = inject(ActivatedRoute);

      appointmentId!: number;
      appointment!: IAppointment

  ngOnInit() {
    this.userid= this.cAuthServices.getUserId();
    this.clientServices.getUpcomingAppointments(this.userid).subscribe({
            next: (res) => {
              this.Appointments = res.Data;

            },
            error: (err) => {
              console.error('Error while fetching upcomming appointment', err);
            },


          })

    this.clientServices.getLastAppointment(this.userid).subscribe({
    next: (res) => {
      this.appointment = res.Data;
      let ProviderId = this.appointment.ProviderId;
      console.log(res.Data);
      console.log(ProviderId);
    },
    error: (err) => {
      console.error('Error while fetching Last appointment', err);
    },
  });

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
