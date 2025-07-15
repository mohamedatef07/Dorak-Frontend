import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landingPage-footer',
  templateUrl: './landingPage-footer.component.html',
  styleUrls: ['./landingPage-footer.component.css'],
  imports: [
    RouterModule
  ]
})
export class LandingPageFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
