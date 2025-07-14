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
  imports: [CommonModule,RouterLink]
})
export class LandingpageNavComponent {

}
