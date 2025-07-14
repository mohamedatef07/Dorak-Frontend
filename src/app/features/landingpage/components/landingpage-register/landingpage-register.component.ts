import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landingpage-register',
  templateUrl: './landingpage-register.component.html',
  styleUrls: ['./landingpage-register.component.css'],
  imports:[RouterLink]
})
export class LandingpageRegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
