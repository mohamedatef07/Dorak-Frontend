import { ButtonModule } from 'primeng/button';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-SidebarClientProfile',
  imports:[ButtonModule, RouterLink,RouterLinkActive],
  templateUrl: './SidebarClientProfile.component.html',
  styleUrls: ['./SidebarClientProfile.component.css'],
     encapsulation: ViewEncapsulation.None

})
export class SidebarClientProfileComponent {

}
