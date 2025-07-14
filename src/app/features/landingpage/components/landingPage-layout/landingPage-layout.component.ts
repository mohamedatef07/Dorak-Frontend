import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ChooseSystemComponent } from '../ChooseSystem/HowITWork.component';
import { HowItWorkComponent } from '../HowItWork/HowItWork.component';
import { IndustriesComponent } from '../Industries/Industries.component';
import { FAQComponent } from '../FAQ/FAQ.component';
import { LandingPageFooterComponent } from '../landingPage-footer/landingPage-footer.component';
import { NavBarComponent } from '../../../client/components/navBar/navBar.component';
import { LandingpageNavComponent } from '../landingpage-nav/landingpage-nav.component';
import { LandingpageRegisterComponent } from '../landingpage-register/landingpage-register.component';

@Component({
  selector: 'app-landingPage-layout',
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css'],
  imports: [
    HeroComponent,
    ChooseSystemComponent,
    HowItWorkComponent,
    IndustriesComponent,
    FAQComponent,
    LandingPageFooterComponent,
    LandingpageNavComponent,
    LandingpageRegisterComponent,
  ],
})
export class LandingPageLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
