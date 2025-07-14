import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { INotification } from '../../../../types/INotification';
import { NotificationsSRService } from '../../../../services/signalR Services/notificationsSR.service';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../../../services/Notification.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-owner-navbar',
  imports: [CommonModule, RouterLink,AvatarModule],
  templateUrl: './owner-navbar.component.html',
  styleUrl: './owner-navbar.component.css',
})
export class OwnerNavbarComponent implements OnInit {
  authServices = inject(AuthService);
  messageServices = inject(MessageService);
  srService = inject(NotificationsSRService);
  cookie = inject(CookieService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  private notificationsListSubscription!: Subscription;

  notifications!: Array<INotification>;
  isDropDownOpen = false;
  isNotificationsDropDownOpen = false;
  UserImage!: string;
  imageLoadFailedMap: { [key: string]: boolean } = {};

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
  goToProfile() {
    this.router.navigate(['/owner/profile']);
    this.isDropDownOpen = false;
  }
  goToSettings() {
    this.router.navigate(['/owner/settings']);
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
    this.notificationService.getNotifications(1, 3).subscribe({
      next: (res) => {
        this.notifications = [...res.Data];
      },
    });
    this.notificationsListSubscription =
      this.srService.notificationsList.subscribe({
        next: (updatedNotifications) => {
          this.notifications = [...updatedNotifications].slice(0,3);
        },
        error: (err) => {
          this.messageServices.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail:
              'The server is experiencing an issue, Please try again soon.',
            life: 4000,
          });
        },
      });
    this.srService.notification.subscribe({
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
  ngOnDestroy(): void {
    this.notificationsListSubscription.unsubscribe();
  }

  onImageError(event: Event, key: string) {
    this.imageLoadFailedMap[key] = true;
  }

  hasImageLoadFailed(key: string): boolean {
    return !!this.imageLoadFailedMap[key];
  }



}
