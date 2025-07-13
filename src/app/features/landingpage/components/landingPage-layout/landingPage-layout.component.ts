import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ChooseSystemComponent } from "../ChooseSystem/HowITWork.component";

@Component({
  selector: 'app-landingPage-layout',
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css'],
  imports: [HeroComponent, ChooseSystemComponent]
})
export class LandingPageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
