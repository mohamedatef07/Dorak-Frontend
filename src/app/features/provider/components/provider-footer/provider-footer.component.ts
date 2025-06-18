import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-provider-footer',
  templateUrl: './provider-footer.component.html',
  styleUrls: ['./provider-footer.component.css'],
  imports :[DatePipe,RouterLink]
})
export class ProviderFooterComponent implements OnInit {
  currentDate = new Date()

  constructor() { }

  ngOnInit() {
  }

}
