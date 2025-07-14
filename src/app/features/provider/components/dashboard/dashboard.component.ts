import { IOperator } from './../../../owner/models/IOperator';
import { Component, inject, OnInit } from '@angular/core';
import { IGeneralStatistics } from '../../models/IGeneralStatistics';
import { ProviderService } from '../../services/provider.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ProgressSpinnerModule],
})
export class DashboardComponent implements OnInit {
  providerService = inject(ProviderService);
  messageServices = inject(MessageService);

  generalStatistics!: IGeneralStatistics;
  loading: boolean = false;

  constructor() {}

  ngOnInit() {
    this.loading = true;
    this.providerService.getGeneralStatistics().subscribe({
      next: (res) => {
        this.generalStatistics = res.Data;
        this.loading = false;
      },
      error: (err) => {
        this.messageServices.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
        this.loading = false;
      },
    });
  }
}
