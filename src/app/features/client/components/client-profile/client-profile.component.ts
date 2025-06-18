import { AuthService } from './../../../../services/auth.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ClientAppointmentsComponent } from "../ClientAppointments/ClientAppointments.component";
import { ClientService } from '../../services/client.service';
import { IClientProfile } from '../../models/IClientProfile';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule, ClientAppointmentsComponent],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent {
   clientServices = inject(ClientService);
cAuthServices = inject(AuthService);

client: IClientProfile = {
  Appointments: [],
  ID: '',
  Name: '',
  Image: '',
  Phone: '',
  Email: ''
};

userid: string = '';
lastAppointments: any;

constructor() {}

ngOnInit() {
  this.userid = this.cAuthServices.getUserId();

  this.clientServices.getClientProfileAndAppointments(this.userid).subscribe({
    next: (res) => {
      this.client = res.Data;
      console.log(res.Data.Image);
      this.client.Image = environment.apiUrl + res.Data.Image;
    },
    error: (err) => {
      console.error('Error while fetching client profile:', err);
    },
  });

  this.clientServices.getLastAppointment(this.userid).subscribe({
    next: (res) => {
      this.lastAppointments = res.Data;
      let appoinmentid = this.lastAppointments.appointmentId;
      console.log(res.Data);
      console.log(appoinmentid);
    },
    error: (err) => {
      console.error('Error while fetching Last appointment', err);
    },
  });
}

}
