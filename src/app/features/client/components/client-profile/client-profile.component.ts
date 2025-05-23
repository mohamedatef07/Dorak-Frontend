import { AuthService } from './../../../../services/auth.service';
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SidebarClientProfileComponent } from "../SidebarClientProfile/SidebarClientProfile.component";
import { ClientAppointmentsComponent } from "../ClientAppointments/ClientAppointments.component";
import { ClientService } from '../../services/client.service';
import { IClientProfileAppointment } from '../../models/IClientProfileAppointment';
import { IAppointment } from '../../models/IAppointment';
@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule, SidebarClientProfileComponent, ClientAppointmentsComponent],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent {
    clientServices = inject(ClientService);
    authServices = inject(AuthService);
    userId= this.authServices.getUserId();
     Profile!: IClientProfileAppointment;
    constructor() {}
    ngOnInit() {
    this.clientServices.getClientAppointments(this.userId).subscribe({
      next: (res) => {
        this.Profile=res.Data;
        console.log(res.Data);
      },
      error: (err) => {
        console.error('Error while fetching doctor reviews:', err);
      },
    });
  }

}
