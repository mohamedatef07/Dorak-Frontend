import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

interface QueueItem {
  id: number;
  name: string;
  status: string;
  number: number;
  isAnonymous: boolean;
  statusSeverity?: 'success' | 'info' | 'warning' | 'danger';
}
@Component({
  selector: 'app-Client-Live-Queue',
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    BadgeModule,
    ProgressBarModule,
    TagModule,
    DividerModule
  ],
  templateUrl: './Client-Live-Queue.component.html',
  styleUrls: ['./Client-Live-Queue.component.css']
})
export class ClientLiveQueueComponent implements OnInit {

 private subscription?: Subscription;

  doctorInfo = {
    name: 'Mohamed Ahmed',
    specialty: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
  };

  statusData = {
    myNumber: 16,
    attendInClinic: 2,
    currentNumber: 12
  };

  currentStep = 2;
  waitingProgress = 65;
  estimatedTime = '2 hours';

  queueItems: QueueItem[] = [
    {
      id: 1,
      name: 'Anonymous',
      status: 'In Consultation',
      number: 10,
      isAnonymous: true,
      statusSeverity: 'info'
    },
    {
      id: 2,
      name: 'Anonymous',
      status: 'Waiting in Clinic',
      number: 13,
      isAnonymous: true,
      statusSeverity: 'warning'
    },
    {
      id: 3,
      name: 'Anonymous',
      status: 'waiting',
      number: 14,
      isAnonymous: true,
      statusSeverity: 'warning'
    },
    {
      id: 4,
      name: 'Amir Nasser (Me)',
      status: 'waiting',
      number: 15,
      isAnonymous: false,
      statusSeverity: 'warning'
    },
    {
      id: 5,
      name: 'Anonymous',
      status: 'Done',
      number: 11,
      isAnonymous: true,
      statusSeverity: 'success'
    }
  ];

  ngOnInit() {
    // Simulate real-time updates
    this.subscription = interval(5000).subscribe(() => {
      this.simulateProgress();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  trackByFn(index: number, item: QueueItem): number {
    return item.id;
  }

  getStepClass(step: number): string {
    return this.currentStep >= step ? 'step-active' : 'step-inactive';
  }

  getProgressLineClass(step: number): string {
    return this.currentStep > step ? 'line-active' : 'line-inactive';
  }

  private simulateProgress() {
    // Simulate queue progression
    if (Math.random() > 0.7) {
      this.statusData.currentNumber = Math.min(
        this.statusData.currentNumber + 1,
        this.statusData.myNumber
      );
      this.updateProgress();
      this.updateQueueStatuses();
    }
  }

  private updateProgress() {
    const total = this.statusData.myNumber - this.statusData.attendInClinic;
    const current = this.statusData.currentNumber - this.statusData.attendInClinic;
    this.waitingProgress = Math.min((current / total) * 100, 100);

    if (this.statusData.currentNumber >= this.statusData.attendInClinic) {
      this.currentStep = 2;
    }
    if (this.statusData.currentNumber >= this.statusData.myNumber) {
      this.currentStep = 3;
    }

    // Update estimated time based on progress
    const remainingPatients = this.statusData.myNumber - this.statusData.currentNumber;
    const estimatedMinutes = remainingPatients * 15; // 15 minutes per patient

    if (estimatedMinutes <= 0) {
      this.estimatedTime = 'Your turn!';
    } else if (estimatedMinutes < 60) {
      this.estimatedTime = `${estimatedMinutes} minutes`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      this.estimatedTime = minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
    }
  }

  private updateQueueStatuses() {
    // Update queue item statuses based on current number
    this.queueItems.forEach(item => {
      if (item.number < this.statusData.currentNumber) {
        item.status = 'Done';
        item.statusSeverity = 'success';
      } else if (item.number === this.statusData.currentNumber) {
        item.status = 'In Consultation';
        item.statusSeverity = 'info';
      }
    });
  }
}
