import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-provider-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './provider-layout.component.html',
  styleUrl: './provider-layout.component.css',
})
export class ProviderLayoutComponent {}
