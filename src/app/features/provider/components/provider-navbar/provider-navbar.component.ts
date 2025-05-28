import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './provider-navbar.component.html',
  styleUrl: './provider-navbar.component.css',
})
export class ProviderNavbarComponent {
  authServices = inject(AuthService);
  messageServices = inject(MessageService);
  router = inject(Router);
  imgUrl = '/images/avatar.png';
  isDropDownOpen = false;
  toggleDropDown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropDownOpen = !this.isDropDownOpen;
  }
  @HostListener('document:click', ['$event'])
  handelOutSideClick(event: MouseEvent) {
    let dropDownIcon = document.getElementById('dropdown-icon');
    let dropDownList = document.getElementById('dropdown-list');
    if (
      dropDownIcon &&
      dropDownList &&
      !dropDownIcon.contains(event.target as Node) &&
      !dropDownIcon.contains(event.target as Node)
    ) {
      this.isDropDownOpen = false;
    }
  }
  handelLogout() {
    this.authServices.logOut().subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }
}
