import { ButtonModule } from 'primeng/button';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-SidebarClientProfile',
  imports: [ButtonModule, RouterLink, RouterLinkActive, Avatar],
  templateUrl: './SidebarClientProfile.component.html',
  styleUrls: ['./SidebarClientProfile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarClientProfileComponent {
  authServices = inject(AuthService);
  fullImagePath!: string;
  clientImage!: string;
  userName!: string;
  imageLoadFailedMap: { [key: string]: boolean } = {};

  onImageError(event: Event, key: string): void {
    this.imageLoadFailedMap[key] = true;
  }

  hasImageLoadFailed(key: string): boolean {
    return !!this.imageLoadFailedMap[key];
  }
  constructor() {}
  ngOnInit(): void {
    this.clientImage = this.authServices.getUserImage();
    this.fullImagePath = `${environment.apiUrl}${this.clientImage}`;
  }
}
