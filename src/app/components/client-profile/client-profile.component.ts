import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule,ButtonModule,CardModule,AvatarModule],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent {
  appointments = Array(6).fill({
  name: 'Mohamed Ahmed',
  rate: '⭐⭐⭐',
  specialization: 'Specialization',
  date: 'date',
  quarter: 'Q-1'
});

editAppointment(index: number) {
  console.log('Editing appointment at index:', index);
}

deleteAppointment(index: number) {
  console.log('Deleting appointment at index:', index);
}
}
