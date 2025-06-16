import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OwnerSidebarComponent } from '../owner-sidebar/owner-sidebar.component';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { OwnerFooterComponent } from "../owner-footer/owner-footer.component";

@Component({
  selector: 'app-owner-layout',
  imports: [
    RouterOutlet,
    OwnerNavbarComponent,
    OwnerLayoutComponent,
    OwnerSidebarComponent,
    OwnerFooterComponent
],
  templateUrl: './owner-layout.component.html',
  styleUrls: ['./owner-layout.component.css'],
})
export class OwnerLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
