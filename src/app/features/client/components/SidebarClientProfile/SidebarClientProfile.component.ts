import { ButtonModule } from 'primeng/button';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { environment } from '../../../../../environments/environment';
import { Avatar } from 'primeng/avatar';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-SidebarClientProfile',
  imports: [ButtonModule, RouterLink, RouterLinkActive, Avatar, CurrencyPipe],
  templateUrl: './SidebarClientProfile.component.html',
  styleUrls: ['./SidebarClientProfile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarClientProfileComponent {
  authServices = inject(AuthService);
  clientService = inject(ClientService);
  fullImagePath!: string;
  clientImage!: string;
  userName!: string;
  balance: number = 0;
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
    this.fetchWalletBalance();
  }

  fetchWalletBalance() {
    const userId = this.authServices.getUserId();
    this.clientService.ClientWalletAndProfile(userId).subscribe({
      next: (res) => {
        this.balance = res.Data.Balance;
      },
      error: (err) => {
        console.error('Error fetching wallet balance:', err);
        this.balance = 0;
      }
    });
  }
}
