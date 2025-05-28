import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../navBar/navBar.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, NavBarComponent, FooterComponent,FooterComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css',
})
export class ClientLayoutComponent {}
