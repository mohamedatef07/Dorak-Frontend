import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-owner-footer',
  templateUrl: './owner-footer.component.html',
  styleUrls: ['./owner-footer.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class OwnerFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
