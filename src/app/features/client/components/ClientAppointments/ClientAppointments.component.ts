import { ClientService } from './../../services/client.service';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IClientProfileAppointment } from '../../models/IClientProfileAppointment';


@Component({
  selector: 'app-ClientAppointments',
  imports:[CommonModule,AvatarModule],
  templateUrl: './ClientAppointments.component.html',
  styleUrls: ['./ClientAppointments.component.css']
})
export class ClientAppointmentsComponent implements OnInit {
  clientServices = inject(ClientService);

  appointments:Array<IClientProfileAppointment> = [];
  constructor() {}
    ngOnInit() {
    this.clientServices.getClientAppointments().subscribe({
      next: (res) => {
        this.appointments=[...res.Data];
        console.log(res.Data);
      },
      error: (err) => {
        console.error('Error while fetching doctor reviews:', err);
      },
    });
  }
  // appointments = Array(6).fill({
  //   name: 'Mohamed Ahmed',
  //   rate: '⭐⭐⭐',
  //   specialization: 'Specialization',
  //   date: 'date',
  //   quarter: 'Q-1'
  // });



  editAppointment(index: number) {
  console.log('Editing appointment at index:', index);
  }

  deleteAppointment(index: number) {
    console.log('Deleting appointment at index:', index);
  }
}
