import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SidebarClientProfileComponent } from "../SidebarClientProfile/SidebarClientProfile.component";
import { ClientAppointmentsComponent } from "../ClientAppointments/ClientAppointments.component";

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule, SidebarClientProfileComponent, ClientAppointmentsComponent],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent {


}
