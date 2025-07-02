import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

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
  items: MenuItem[] = [
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
          label: 'Schedule Doctors',
          icon: 'pi pi-calendar-clock',
          routerLink: '/owner/provider-schedule',
        },
        {
          label: 'Add Doctors',
          icon: 'pi pi-user-plus',
          routerLink: '/owner/add-provider',
        },

        {
          label: 'Search Doctors',
          icon: 'pi pi-search',
          routerLink: '/owner/search-provider',
        },
      ]
    },
    {
      label: 'Manage Queues',
      icon: 'pi pi-calendar',
      routerLink: '/provider/schedule',
    },
    {
      label: 'Manage Operators',
      icon: 'pi pi-cog',
      routerLink: 'manage-operators',
      items: [
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
    },
  ];

  constructor() {}

  ngOnInit() {
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
