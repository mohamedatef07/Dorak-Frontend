import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/Notification.service';
import { INotification } from '../../../../types/INotification';

@Component({
  selector: 'app-owner-navbar',
  templateUrl: './owner-navbar.component.html',
  styleUrls: ['./owner-navbar.component.css']
})
export class OwnerNavbarComponent implements OnInit {
  notificationService = inject(NotificationService);
  notifications!: Array<INotification>;
  constructor() { }

  ngOnInit() {
    this.notificationService.getNotifications(1, 3).subscribe({
      next: (res) => {
        this.notifications = [...res.Data];
      },
    });
  }

}
