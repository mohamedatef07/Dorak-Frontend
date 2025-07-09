import { HeroComponent } from './../hero/hero.component';
import { Component, OnInit } from '@angular/core';
import { CtaComponent } from '../cta/cta.component';
import { FeaturesComponent } from '../Features/Features.component';

import { HeaderComponent } from '../header/header.component';
import { HowITWorkComponent } from '../HowITWork/HowITWork.component';
import { StatesComponent } from '../states/states.component';
import { TestimonialsComponent } from '../Testimonials/Testimonials.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-landingPage-layout',
  imports: [CtaComponent, FeaturesComponent, HeroComponent, HeaderComponent, HowITWorkComponent, StatesComponent, TestimonialsComponent, FooterComponent],
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css']
})
export class LandingPageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
