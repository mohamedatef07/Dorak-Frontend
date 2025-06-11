import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-provider-sidebar',
  templateUrl: './provider-sidebar.component.html',
  styleUrls: ['./provider-sidebar.component.css'],
  imports: [DatePipe,RouterLink,RouterLinkActive],
})
export class ProviderSidebarComponent implements OnInit {
  dateNow = new Date();
  constructor() {}
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.dateNow = new Date();
    }, 1000);
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
