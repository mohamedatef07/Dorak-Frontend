import { Component, inject, OnInit } from '@angular/core';
import { INotification } from '../../../../types/INotification';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../../../services/Notification.service';

@Component({
  selector: 'app-client-notifications',
  templateUrl: './client-notifications.component.html',
  styleUrls: ['./client-notifications.component.css'],
  imports: [DatePipe],
})
export class ClientNotificationsComponent implements OnInit {
  notificationService = inject(NotificationService);
  notifications!: Array<INotification>;

  constructor() {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = [...res.Data];
      },
    });
  }
}
