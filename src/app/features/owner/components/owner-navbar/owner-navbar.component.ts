import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/Notification.service';
import { INotification } from '../../../../types/INotification';
import { NotificationsSRService } from '../../../../services/signalR Services/notificationsSR.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-owner-navbar',
  templateUrl: './owner-navbar.component.html',
  styleUrls: ['./owner-navbar.component.css']
})
export class OwnerNavbarComponent implements OnInit {
  notificationService = inject(NotificationService);
  notificationsSRService = inject(NotificationsSRService);
  messageServices = inject(MessageService);
  notifications!: Array<INotification>;
  constructor() { }

  ngOnInit() {
    this.notificationService.getNotifications(1, 3).subscribe({
      next: (res) => {
        this.notifications = [...res.Data];
      },
    });

    this.notificationsSRService.notification.subscribe({
    next: (notification) => {
      this.notificationService.showNotificationToast(notification);
    },
    error: (err) => {
      this.messageServices.add({
        key: 'main-toast',
        severity: 'error',
        summary: 'Error',
        detail: 'The server is experiencing an issue, Please try again soon.',
        life: 4000,
      });
      },
    });
  }
}
