import { Component, inject, OnInit } from '@angular/core';
import { ProviderService } from '../../features/provider/services/provider.service';
import { INotification } from '../../features/provider/models/INotification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [DatePipe],
})
export class NotificationsComponent implements OnInit {
  providerServices = inject(ProviderService);
  notifications!: Array<INotification>;

  constructor() {}

  ngOnInit() {
    this.providerServices.getNotifications().subscribe({
      next: (res) => {
        this.notifications = [...res.Data];
      },
    });
  }
}
