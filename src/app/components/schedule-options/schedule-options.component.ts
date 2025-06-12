import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-schedule-options',
  templateUrl: './schedule-options.component.html',
  styleUrls: ['./schedule-options.component.css']
})
export class ScheduleOptionsComponent implements OnInit {
  option: string = 'weekly';
  providerId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    console.log('ScheduleOptionsComponent initialized at:', new Date().toISOString());
    console.log('Current route snapshot:', this.route.snapshot);
    console.log('Route parameters:', this.route.snapshot.paramMap);

    this.providerId = this.route.snapshot.paramMap.get('providerId');
    if (!this.providerId) {

      const paramMap = this.route.snapshot.paramMap;
      const keys: string[] = paramMap.keys;
      console.error('Provider ID not found in route. Available parameters:', keys);
      this.router.navigate(['/add-provider']);
    } else {
      console.log('Loaded providerId:', this.providerId);
    }
  }

  setOption(option: string): void {
    this.option = option;
    console.log(`Selected mode: ${option}`);
  }

  continue(): void {
    if (this.providerId) {
      if (this.option === 'manual') {
        this.router.navigate(['/manually-schedule', this.providerId]);
      } else if (this.option === 'weekly') {
        this.router.navigate(['/weekly-schedule', this.providerId]);
      }
    } else {
      console.error('Provider ID not found');
    }
  }
}
