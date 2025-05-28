import { Component, OnInit } from '@angular/core';
import { HeroComponent } from "../../components/hero/hero.component";
import { NavBarComponent } from "../../../client/components/navBar/navBar.component";
import { DoctorsComponent } from '../../components/doctors/doctors.component';
import { ReviewComponent } from "../../components/review/review.component";
import { LandingpageRegisterComponent } from "../../components/landingpageRegister/landingpageRegister.component";
import { CertificationsComponent } from "../../components/Certifications/Certifications.component";
import { LandingpagefooterComponent } from "../../components/landingpagefooter/landingpagefooter.component";
@Component({
  selector: 'app-landingpage-layout',
  templateUrl: './landingpage-layout.component.html',
  styleUrls: ['./landingpage-layout.component.css'],
  imports: [HeroComponent, NavBarComponent, DoctorsComponent, ReviewComponent, LandingpageRegisterComponent, CertificationsComponent, LandingpagefooterComponent],
})
export class LandingpageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
