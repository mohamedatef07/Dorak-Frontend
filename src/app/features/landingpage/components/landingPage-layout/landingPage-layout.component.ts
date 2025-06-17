import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ReviewComponent } from '../review/review.component';
import { NavClientComponent } from '../nav-client/nav-client.component';
import { LandingPageFooterComponent } from '../landingPage-Footer/landingPage-Footer.component';
import { LandingPageCertificationsComponent } from '../landingPage-Certifications/landingPage-Certifications.component';
import { LandingPageRegisterComponent } from '../landingPage-register/landingPage-register.component';

@Component({
  selector: 'app-landingPage-layout',
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css'],
  imports: [
    HeroComponent,
    NavClientComponent,
    ReviewComponent,
    LandingPageFooterComponent,
    NavClientComponent,
    LandingPageRegisterComponent,
    LandingPageCertificationsComponent,
  ],
})
export class LandingPageLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
