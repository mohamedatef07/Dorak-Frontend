import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports:[RouterLinkActive,],
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class NavBarComponent implements OnInit {
  currentTheme: 'light' | 'dark' = 'light';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('dorak-theme') as 'light' | 'dark';
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;
    this.renderer.setAttribute(document.body, 'data-theme', theme);
    localStorage.setItem('dorak-theme', theme);
  }
}
