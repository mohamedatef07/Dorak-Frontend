import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ReviewComponent } from '../review/review.component';
// import { LandingPageRegisterComponent } from '../landingPageRegister/landingPageRegister.component';
import { NavClientComponent } from '../nav-client/nav-client.component';
import { DoctorsLandingPageComponent } from '../doctors-landingPage/doctors-landingPage.component';
// import { CertificationsComponent } from '../certifications/certifications.component';
// import { LandingPageFooterComponent } from '../landingPageFooter/landingPageFooter.component';
@Component({
  selector: 'app-landingPage-layout',
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css'],
  imports: [
    HeroComponent,
    NavClientComponent,
    ReviewComponent,
    // LandingPageRegisterComponent,
    // CertificationsComponent,
    // LandingPageFooterComponent,
    NavClientComponent,
    DoctorsLandingPageComponent,
  ],
})
export class LandingPageLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
