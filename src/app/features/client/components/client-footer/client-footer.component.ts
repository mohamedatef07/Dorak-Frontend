import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-footer',
  templateUrl: './client-footer.component.html',
  styleUrls: ['./client-footer.component.css'],
  imports: [RouterLink, DatePipe],
})
export class ClientFooterComponent implements OnInit {
  currentDate = new Date();

  constructor() {}

  ngOnInit() {}
}
