import { Component, OnInit } from '@angular/core';
import { HeroComponent } from "../../components/hero/hero.component";
import { ReviewComponent } from "../../components/review/review.component";
import { LandingpageRegisterComponent } from "../../components/landingpageRegister/landingpageRegister.component";
import { CertificationsComponent } from "../../components/Certifications/Certifications.component";
import { LandingpagefooterComponent } from "../../components/landingpagefooter/landingpagefooter.component";
import { NavClientComponent } from "../../components/nav-client/nav-client.component";
import { DoctorsLandingPageComponent } from "../../components/doctors-landingPage/doctors-landingPage.component";
@Component({
  selector: 'app-landingpage-layout',
  templateUrl: './landingpage-layout.component.html',
  styleUrls: ['./landingpage-layout.component.css'],
  imports: [HeroComponent, NavClientComponent, ReviewComponent, LandingpageRegisterComponent, CertificationsComponent, LandingpagefooterComponent, NavClientComponent, DoctorsLandingPageComponent],
})
export class LandingpageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
