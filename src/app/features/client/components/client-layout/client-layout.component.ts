import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarClientProfileComponent } from '../SidebarClientProfile/SidebarClientProfile.component';
import { NavBarComponent } from '../navBar/navBar.component';
import { ClientFooterComponent } from '../client-footer/client-footer.component';

@Component({
  selector: 'app-client-layout',
  imports: [
    RouterOutlet,
    SidebarClientProfileComponent,
    NavBarComponent,

    ClientFooterComponent
],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css',
})
export class ClientLayoutComponent {}
