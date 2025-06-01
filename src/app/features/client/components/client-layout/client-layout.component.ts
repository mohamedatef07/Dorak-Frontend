import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarClientProfileComponent } from "../SidebarClientProfile/SidebarClientProfile.component";

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, SidebarClientProfileComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css',
})
export class ClientLayoutComponent {}
