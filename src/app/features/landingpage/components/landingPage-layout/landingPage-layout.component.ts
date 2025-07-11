import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-landingPage-layout', 
 standalone: true,
 imports:[CommonModule,RouterModule,HeroComponent],
  templateUrl: './landingPage-layout.component.html',
  styleUrls: ['./landingPage-layout.component.css']
})
export class LandingPageLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
