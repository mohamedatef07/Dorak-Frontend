import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProviderService } from '../../services/provider.service';
import { INotification } from '../../../../types/INotification';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html',
  styleUrls: ['./provider-notifications.component.css'],
  imports: [DatePipe],
})
export class ProviderNotificationsComponent implements OnInit {
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
