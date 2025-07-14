import { AuthService } from './../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-owner-sidebar',
  templateUrl: './owner-sidebar.component.html',
  styleUrls: ['./owner-sidebar.component.css'],
  imports: [RouterModule, CommonModule, PanelMenuModule],
})
export class OwnerSidebarComponent implements OnInit {
  currentDate = new Date();
  private intervalId: any;

  isSubmenuOpen = false;
  isOperatorSubmenuOpen = false;
  userRole: string | null = null;
  items: MenuItem[] = [];

  private adminItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-desktop',
      routerLink: '/owner/dashboard',
    },
    {
      label: 'Manage Doctors',
      icon: 'pi pi-users',
      items: [
        {
          label: 'View Doctors',
          icon: 'fa fa-user-doctor',
          routerLink: '/owner/provider-management',
        },
        {
          label: 'Search Doctors',
          icon: 'fa fa-magnifying-glass',
          routerLink: '/owner/search-provider',
        },
        {
          label: 'Add Doctors',
          icon: 'fa fa-user-plus',
          routerLink: '/owner/add-provider',
        },
      ],
    },
    {
      label: 'Manage Services',
      icon: 'pi pi-briefcase',
      items: [
        {
          label: 'View Services',
          icon: 'pi pi-list',
          routerLink: '/owner/provider-center-services',
        },
        {
          label: 'Assign Service',
          icon: 'pi pi-plus-circle',
          routerLink: '/owner/assign-service-to-provider-center',
        },
      ],
    },

    {
      label: 'Manage Operators',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'View Operators',
          icon: 'pi pi-user',
          routerLink: 'manage-operators',
        },
        {
          label: 'Add Operator',
          icon: 'pi pi-user-plus',
          routerLink: 'add-operator',
        },

      ],
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar',
      routerLink: '/provider/reports',
    }
  ];

  private providerItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-desktop',
      routerLink: '/owner/dashboard',
    },
    {
      label: 'Manage Doctors',
      icon: 'pi pi-users',
      items: [
        {
          label: 'View Doctors',
          icon: 'fa fa-user-doctor',
          routerLink: '/owner/provider-management',
        },
        {
          label: 'Search Doctors',
          icon: 'fa fa-magnifying-glass',
          routerLink: '/owner/search-provider',
        },
        {
          label: 'Add Doctors',
          icon: 'fa fa-user-plus',
          routerLink: '/owner/add-provider',
        },
      ],
    },
    {
      label: 'Manage Queues',
      icon: 'pi pi-calendar',
      items: [
        {
          label: 'View Queues',
          icon: 'pi pi-calendar-clock',
          routerLink: '/owner/center-shifts-table',
        },
        {
          label: 'Create Appointment',
          icon: 'pi pi-calendar-plus',
          routerLink: '/owner/create-appointment',
        },

      ],
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar',
      routerLink: '/provider/reports',
    },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();

    if (this.userRole === 'Admin') {
      this.items = this.adminItems;
    } else {
      this.items = this.providerItems;
    }

    this.intervalId = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  toggleOperatorSubmenu() {
    this.isOperatorSubmenuOpen = !this.isOperatorSubmenuOpen;
  }
}
