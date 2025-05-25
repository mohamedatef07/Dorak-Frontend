import { ClientService } from './../../services/client.service';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IClientProfileAppointment } from '../../models/IClientProfileAppointment';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ClientAppointments',
  imports:[CommonModule,AvatarModule,RatingModule,CommonModule,FormsModule],
  templateUrl: './ClientAppointments.component.html',
  styleUrls: ['./ClientAppointments.component.css']
})
export class ClientAppointmentsComponent implements OnInit {

  @Input() appointments:Array<IClientProfileAppointment> = [];
  constructor() {}
    ngOnInit() {

  }

  editAppointment(index: number) {
  console.log('Editing appointment at index:', index);
  }

  deleteAppointment(index: number) {
    console.log('Deleting appointment at index:', index);
  }
}
