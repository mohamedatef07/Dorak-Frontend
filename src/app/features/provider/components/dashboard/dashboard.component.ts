import { Component, inject, OnInit } from '@angular/core';
import { IGeneralStatistics } from '../../models/IGeneralStatistics';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  providerService = inject(ProviderService);
  generalStatistics!: IGeneralStatistics;
  constructor() {}

  ngOnInit() {
    this.providerService.getGeneralStatistics().subscribe({
      next: (res) => {
        this.generalStatistics = res.Data;
      },
      error: (err) => {
        console.error('Error fetching general statistics:', err);
      },
    });
  }
}
