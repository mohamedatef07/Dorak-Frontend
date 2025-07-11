import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/Hero.component';


@Component({
  selector: 'app-landingPage-layout',
 standalone: true,
 imports:[HeroComponent],
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css']
})
export class LandingPageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
