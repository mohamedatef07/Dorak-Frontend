import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  imports: [ChartModule],
})
export class ReportsComponent implements OnInit {
  constructor() {}

  chartData: any; // This will hold your data
  chartOptions: any; // This will hold your options

  ngOnInit() {
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Current Year Sales',
          backgroundColor: '#42A5F5', // A vibrant blue
          borderColor: '#1E88E5',     // A darker blue
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Previous Year Sales',
          backgroundColor: '#9CCC65', // A pleasant green
          borderColor: '#7CB342',     // A darker green
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
}
}
