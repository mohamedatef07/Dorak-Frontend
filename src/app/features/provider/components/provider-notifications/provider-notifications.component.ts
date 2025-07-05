import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProviderService } from '../../services/provider.service';
import { INotification } from '../../../../types/INotification';
import { NotificationService } from '../../../../services/Notification.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html',
  styleUrls: ['./provider-notifications.component.css'],
  imports: [DatePipe],
})
export class ProviderNotificationsComponent implements OnInit {
  providerServices = inject(ProviderService);
  notificationService = inject(NotificationService);
  messageService = inject(MessageService);
  notifications!: Array<INotification>;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
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
          this.notifications = [...res.Data];
          this.totalRecords = res.TotalRecords;
          this.currentPage = res.CurrentPage;
          this.pageSize = res.PageSize;
          this.totalPages = res.TotalPages;
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
  }
}
