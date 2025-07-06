import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProviderFooterComponent } from '../provider-footer/provider-footer.component';
import { ProviderNavbarComponent } from '../provider-navbar/provider-navbar.component';
import { ProviderSidebarComponent } from '../provider-sidebar/provider-sidebar.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-provider-layout',
  imports: [
    RouterOutlet,
    ProviderNavbarComponent,
    ProviderSidebarComponent,
    ProviderFooterComponent,
    ToastModule,
  ],
  templateUrl: './provider-layout.component.html',
  styleUrl: './provider-layout.component.css',
})
export class ProviderLayoutComponent {}
