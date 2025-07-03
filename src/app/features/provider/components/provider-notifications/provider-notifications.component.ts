import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProviderService } from '../../services/provider.service';
import { INotification } from '../../../../types/INotification';
import { NotificationService } from '../../../../services/Notification.service';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html',
  styleUrls: ['./provider-notifications.component.css'],
  imports: [DatePipe],
})
export class ProviderNotificationsComponent implements OnInit {
  providerServices = inject(ProviderService);
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
