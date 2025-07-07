import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  styleUrls: ['./client-settings.component.css'],
})
export class ClientSettingsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
