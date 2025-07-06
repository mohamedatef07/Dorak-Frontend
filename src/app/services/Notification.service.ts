import { inject, Injectable } from '@angular/core';
import { INotification } from '../types/INotification';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationApiResponse } from '../types/PaginationApiResponse';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  httpClient = inject(HttpClient);
  messageService = inject(MessageService);

  // Shared state for notifications
  private notificationsSubject = new BehaviorSubject<Array<INotification>>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  // Track read status locally
  private readNotificationIds = new Set<number>();

  constructor() {}

  getNotifications(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationApiResponse<Array<INotification>>> {
    return this.httpClient.get<PaginationApiResponse<Array<INotification>>>(
      `${environment.apiUrl}/api/Notification/notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  showNotificationToast(notification: INotification): void {
    this.messageService.add({
      key: 'notification-toast',
      severity: 'info',
      summary: notification.Title,
      detail: notification.Message,
      life: 4000,
    });
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/api/Notification/MarkAsRead/${notificationId}`,
      {}
    );
  }

  // Update local read status
  updateLocalReadStatus(notificationId: number, isRead: boolean): void {
    if (isRead) {
      this.readNotificationIds.add(notificationId);
    } else {
      this.readNotificationIds.delete(notificationId);
    }
  }

  // Check if notification is read locally
  isNotificationReadLocally(notificationId: number): boolean {
    return this.readNotificationIds.has(notificationId);
  }

  // Update notifications with local read status
  updateNotificationsWithLocalStatus(notifications: Array<INotification>): Array<INotification> {
    return notifications.map(notification => ({
      ...notification,
      IsRead: notification.IsRead || this.readNotificationIds.has(notification.NotificationId)
    }));
  }

  // Get unread count
  getUnreadCount(notifications: Array<INotification>): number {
    return notifications.filter(notification =>
      !notification.IsRead && !this.readNotificationIds.has(notification.NotificationId)
    ).length;
  }

  // Clear all read status (useful for logout)
  clearReadStatus(): void {
    this.readNotificationIds.clear();
  }

  // Shared method to handle notification click
  handleNotificationClick(notification: INotification, messageService: MessageService): void {
    if (!notification.IsRead) {
      this.markAsRead(notification.NotificationId).subscribe({
        next: () => {
          notification.IsRead = true;
          this.updateLocalReadStatus(notification.NotificationId, true);
        },
        error: (err) => {
          messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to mark notification as read.',
            life: 4000,
          });
        }
      });
    }
  }

  // Shared method to mark all notifications as read
  markAllNotificationsAsRead(notifications: Array<INotification>, messageService: MessageService): void {
    const unreadNotifications = notifications.filter(n => !n.IsRead);
    if (unreadNotifications.length === 0) return;

    unreadNotifications.forEach(notification => {
      this.markAsRead(notification.NotificationId).subscribe({
        next: () => {
          notification.IsRead = true;
          this.updateLocalReadStatus(notification.NotificationId, true);
        },
        error: (err) => {
          messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to mark notification as read.',
            life: 4000,
          });
        }
      });
    });
  }
}
