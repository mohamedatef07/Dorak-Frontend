import { Component, OnInit } from '@angular/core';
import { ProviderSidebarComponent } from '../provider-sidebar/provider-sidebar.component';
import { IProviderProfile } from '../../../../types/IProviderProfile';
import { ProviderService } from '../../services/provider.service';
import { GenderType } from '../../../../Enums/GenderType.enum';
import { environment } from '../../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.css'],
  imports: [DatePipe, AvatarModule],
})
export class ProviderProfileComponent implements OnInit {
  profile: IProviderProfile | null = null;
  genderEnum = GenderType;
  fullImagePath: string = '';
  imageLoadFailed = false;

  constructor(
    private ProviderProfileService: ProviderService,
    private messageServices: MessageService
  ) {}

  getProviderProfile(): void {
    this.ProviderProfileService.getProviderProfile().subscribe({
      next: (res) => {
        this.profile = res.Data;
        if (this.profile?.Image) {
          this.fullImagePath = `${environment.apiUrl}${this.profile.Image}`;
        } else {
          this.fullImagePath = '';
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.messageServices.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading profile',
          life: 4000,
        });
      },
    });
  }

  onImageError() {
    console.log('Image error occurred, setting imageLoadFailed to true');
    this.imageLoadFailed = true;
  }

  ngOnInit(): void {
    this.getProviderProfile();
  }
}
