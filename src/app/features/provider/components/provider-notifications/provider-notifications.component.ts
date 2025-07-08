import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { ProviderService } from '../../services/provider.service';
import { INotification } from '../../../../types/INotification';
import { NotificationService } from '../../../../services/Notification.service';
import { MessageService } from 'primeng/api';
import { NotificationsSRService } from '../../../../services/signalR Services/notificationsSR.service';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html',
  styleUrls: ['./provider-notifications.component.css'],
  imports: [DatePipe, CommonModule],
})
export class ProviderNotificationsComponent implements OnInit {
  providerServices = inject(ProviderService);
  notificationService = inject(NotificationService);
  messageService = inject(MessageService);
  srService = inject(NotificationsSRService);
  notifications!: Array<INotification>;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  unreadCount = 0;

  constructor() {}

  ngOnInit() {
    this.loadNotifications();
  }

  nextPage() {
    this.currentPage++;
    this.loadNotifications();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadNotifications();
    }
  }

  get canGoNext(): boolean {
    return this.currentPage * this.pageSize < this.totalRecords;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  loadNotifications() {
    this.notificationService
      .getNotifications(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          const notificationsWithLocalStatus =
            this.notificationService.updateNotificationsWithLocalStatus(
              res.Data
            );
          this.notifications = [...notificationsWithLocalStatus];
          this.totalRecords = res.TotalRecords;
          this.currentPage = res.CurrentPage;
          this.pageSize = res.PageSize;
          this.totalPages = res.TotalPages;
          this.updateUnreadCount();
        },
        error: (err) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail:
              'The server is experiencing an issue, Please try again soon.',
            life: 4000,
          });
        },
      });

    this.srService.notificationsList.subscribe({
      next: (updatedNotifications) => {
        // Use shared service to update notifications with local read status
        const updatedNotificationsWithLocalChanges =
          this.notificationService.updateNotificationsWithLocalStatus(
            updatedNotifications
          );
        this.notifications = [...updatedNotificationsWithLocalChanges];
        this.updateUnreadCount();
      },
      error: (err) => {
        this.messageService.add({
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
    this.unreadCount = this.notificationService.getUnreadCount(
      this.notifications
    );
  }

  handleNotificationClick(notification: INotification) {
    this.notificationService.handleNotificationClick(
      notification,
      this.messageService
    );
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        // Mark all notifications as read locally
        this.notifications.forEach((notification) => {
          notification.IsRead = true;
          this.notificationService.updateLocalReadStatus(
            notification.NotificationId,
            true
          );
        });
        this.updateUnreadCount();
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'All notifications marked as read.',
          life: 3000,
        });
      },
      error: (err) => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to mark all notifications as read.',
          life: 4000,
        });
      },
    });
  }
}
