import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentDate: string = '';
  currentTime: string = '';
  constructor() { }

  ngOnInit(): void {
    this.updateDateTime();

    setInterval(() => {
      this.updateDateTime();
    }, 1000); // updates every second
  }

updateDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = now.getFullYear();

  this.currentDate = `${day}/${month}/${year}`;
  this.currentTime = now.toLocaleTimeString(); // keeps standard format like "5:35:00 PM"
}

}
