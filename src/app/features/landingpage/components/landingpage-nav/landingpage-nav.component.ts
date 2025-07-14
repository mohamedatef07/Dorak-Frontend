import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { INotification } from '../../../../types/INotification';
import { AuthService } from '../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ProviderService } from '../../../provider/services/provider.service';
import { NotificationsSRService } from '../../../../services/signalR Services/notificationsSR.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../../../services/Notification.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-landingpage-nav',
  templateUrl: './landingpage-nav.component.html',
  styleUrls: ['./landingpage-nav.component.css'],
  imports: [CommonModule, RouterLink, Avatar]
})
export class LandingpageNavComponent implements OnInit {
  isAuthenticated = false;
  userImage: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const image = this.authService.getUserImage();
      this.userImage = image ? `${environment.apiUrl}${image}` : null;
      this.userRole = this.authService.getUserRole();
    }
  }

  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getDashboardUrl(): string {
    switch (this.userRole) {
      case 'Client':
        return '/client/doctors';
      case 'Admin':
      case 'Operator':
        return '/owner';
      case 'Provider':
        return '/provider';
      default:
        return '/home';
    }
  }

  getDashboardDisplayName(): string {
    switch (this.userRole) {
      case 'Client':
        return 'Doctors';
      case 'Admin':
      case 'Operator':
        return 'Dashboard';
      case 'Provider':
        return 'Dashboard';
      default:
        return 'Dashboard';
    }
  }

  navigateToDashboard() {
    this.router.navigate([this.getDashboardUrl()]);
  }

  logout() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/login']);
      this.isAuthenticated = false;
      this.userImage = null;
      this.userRole = null;
    });
  }
}
