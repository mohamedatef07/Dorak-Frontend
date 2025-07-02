import { ButtonModule } from 'primeng/button';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-SidebarClientProfile',
  imports: [ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './SidebarClientProfile.component.html',
  styleUrls: ['./SidebarClientProfile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarClientProfileComponent {
  authServices = inject(AuthService);
  fullImagePath!: string;
  clientImage!: string;
  userName!: string;

  constructor() {}
  ngOnInit(): void {
    this.clientImage = this.authServices.getUserImage();
    this.fullImagePath = `${environment.apiUrl}${this.clientImage}`;
  }
}
