import { inject, Injectable } from '@angular/core';
import { INotification } from '../types/INotification';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationApiResponse } from '../types/PaginationApiResponse';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../types/ApiResponse';

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

  markAsRead(notificationId: number): Observable<null> {
    return this.httpClient.post<null>(
      `${environment.apiUrl}/api/Notification/MarkAsRead/${notificationId}`,
      {}
    );
  }
  markAllAsRead(): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      `${environment.apiUrl}/api/Notification/MarkAllAsRead`,
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

  // Update notifications with local read status
  updateNotificationsWithLocalStatus(
    notifications: Array<INotification>
  ): Array<INotification> {
    return notifications.map((notification) => ({
      ...notification,
      IsRead:
        notification.IsRead ||
        this.readNotificationIds.has(notification.NotificationId),
    }));
  }

  // Get unread count
  getUnreadCount(notifications: Array<INotification>): number {
    return notifications.filter(
      (notification) =>
        !notification.IsRead &&
        !this.readNotificationIds.has(notification.NotificationId)
    ).length;
  }

  // Shared method to handle notification click
  handleNotificationClick(
    notification: INotification,
    messageService: MessageService
  ): void {
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
        },
      });
    }
  }
}
