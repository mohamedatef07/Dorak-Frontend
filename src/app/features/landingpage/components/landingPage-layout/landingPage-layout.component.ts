import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ChooseSystemComponent } from "../ChooseSystem/HowITWork.component";
import { HowItWorkComponent } from '../HowItWork/HowItWork.component';
import { IndustriesComponent } from '../Industries/Industries.component';
import { FAQComponent } from '../FAQ/FAQ.component';
import { LandingPageFooterComponent } from "../landingPage-footer/landingPage-footer.component";

@Component({
  selector: 'app-landingPage-layout',
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css'],
  imports: [HeroComponent, ChooseSystemComponent, HowItWorkComponent, IndustriesComponent, FAQComponent, LandingPageFooterComponent]
})
export class LandingPageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
