import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landingPage-Footer',
  templateUrl: './landingPage-Footer.component.html',
  styleUrls: ['./landingPage-Footer.component.css',
              '..//../../../styles/general.css'],
  imports: [DatePipe,RouterLink]
})
export class LandingPageFooterComponent implements OnInit {
  currentDate = new Date();

  constructor() { }

  ngOnInit() {
  }

}
