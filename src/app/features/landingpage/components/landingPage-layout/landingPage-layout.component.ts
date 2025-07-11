import { HeroComponent } from './../hero/hero.component';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-landingPage-layout',
 standalone: true,
 imports:[HeroComp
  onent],
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css']
})
export class LandingPageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
