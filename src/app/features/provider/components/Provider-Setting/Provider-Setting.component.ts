import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-Provider-Setting',
  templateUrl: './Provider-Setting.component.html',
  imports:[RouterLink,RouterLinkActive,RouterOutlet],
  styleUrls: ['./Provider-Setting.component.css']
})
export class ProviderSettingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
