import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ProviderService } from '../../../provider/services/provider.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { NotificationsSRService } from '../../../../services/signalR Services/notificationsSR.service';
import { INotification } from '../../../../types/INotification';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../../../services/Notification.service';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css'],
})
export class NavBarComponent implements OnInit {
  authServices = inject(AuthService);
  providerServices = inject(ProviderService);
  messageServices = inject(MessageService);
  srService = inject(NotificationsSRService);
  cookie = inject(CookieService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  unreadCount = 0;
  notifications: Array<INotification> = [];
  isDropDownOpen = false;
  isNotificationsDropDownOpen = false;
  UserImage!: string;

  toggleDropDown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropDownOpen = !this.isDropDownOpen;
    this.isNotificationsDropDownOpen = false;
  }

  toggleNotificationsDropDown(event: MouseEvent) {
    event.stopPropagation();
    this.isNotificationsDropDownOpen = !this.isNotificationsDropDownOpen;
    this.isDropDownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handelOutSideClick(event: MouseEvent) {
    let dropDownIcon = document.getElementById('dropdown-icon');
    let dropDownList = document.getElementById('dropdown-list');
    if (
      dropDownIcon &&
      dropDownList &&
      !dropDownIcon.contains(event.target as Node) &&
      !dropDownIcon.contains(event.target as Node)
    ) {
      this.isDropDownOpen = false;
      this.isNotificationsDropDownOpen = false;
    }
  }

  handelLogout() {
    this.authServices.logOut().subscribe({
      next: (res) => {
        this.cookie.delete('token');
        this.router.navigate(['/login']);
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

  ngOnInit() {
    this.UserImage = `${environment.apiUrl}${this.authServices.getUserImage()}`;
    this.loadNotifications();
    this.setupSignalRSubscriptions();
  }

  loadNotifications() {
    this.notificationService.getNotifications(1, 3).subscribe({
      next: (res) => {
        const notificationsWithLocalStatus = this.notificationService.updateNotificationsWithLocalStatus(res.Data);
        this.notifications = [...notificationsWithLocalStatus];
        this.updateUnreadCount();
      },
      error: (err) => {
        this.messageServices.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load notifications. Please try again soon.',
          life: 4000,
        });
      },
    });
  }

  setupSignalRSubscriptions() {
    this.srService.notificationsList.subscribe({
      next: (updatedNotifications) => {
        // Use shared service to update notifications with local read status
        const updatedNotificationsWithLocalChanges = this.notificationService.updateNotificationsWithLocalStatus(updatedNotifications);
        this.notifications = [...updatedNotificationsWithLocalChanges].slice(0, 3);
        this.updateUnreadCount();
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

    this.srService.notification.subscribe({
      next: (notification) => {
        this.notificationService.showNotificationToast(notification);
        // Add new notification to the list and update count
        this.notifications.unshift(notification);
        if (this.notifications.length > 3) {
          this.notifications = this.notifications.slice(0, 3);
        }
        this.updateUnreadCount();
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

  updateUnreadCount() {
    this.unreadCount = this.notificationService.getUnreadCount(this.notifications);
  }

  handleNotificationClick(notification: INotification) {
    this.notificationService.handleNotificationClick(notification, this.messageServices);
    this.updateUnreadCount();
  }
}
