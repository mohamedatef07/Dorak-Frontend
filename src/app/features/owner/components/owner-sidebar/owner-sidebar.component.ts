import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-owner-sidebar',
  templateUrl: './owner-sidebar.component.html',
  styleUrls: ['./owner-sidebar.component.css'],
  imports: [RouterLink, RouterModule,CommonModule],
})
export class OwnerSidebarComponent implements OnInit {
  currentDate: string = '';
  currentTime: string = '';
  isSubmenuOpen = false;
  isOperatorSubmenuOpen = false;

  constructor() { }
  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  toggleOperatorSubmenu() {
    this.isOperatorSubmenuOpen = !this.isOperatorSubmenuOpen;
  }

  updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    this.currentDate = `${day}/${month}/${year}`;
    this.currentTime = now.toLocaleTimeString();
  }
}
