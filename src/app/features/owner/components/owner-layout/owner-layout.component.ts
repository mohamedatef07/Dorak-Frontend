import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-owner-layout',
  imports:[RouterOutlet],
  templateUrl: './owner-layout.component.html',
  styleUrls: ['./owner-layout.component.css']
})
export class OwnerLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
