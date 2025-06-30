import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { INotification } from '../../../../types/INotification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-notifications',
  templateUrl: './client-notifications.component.html',
  styleUrls: ['./client-notifications.component.css'],
  imports: [DatePipe],
})
export class ClientNotificationsComponent implements OnInit {
  clientServices = inject(ClientService);
  notifications!: Array<INotification>;

  constructor() {}

  ngOnInit() {
    this.clientServices.getNotifications().subscribe({
      next: (res) => {
        this.notifications = [...res.Data];
      },
    });
  }
}
