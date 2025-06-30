import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { UpdateQueueStatusSRService } from '../../../../services/signalR Services/updateQueueStatusSR.service';
import { IClientLiveQueue } from '../../models/IClientLiveQueue';
import { AuthService } from '../../../../services/auth.service';
import { IClientInfoForLiveQueue } from '../../models/IClientInfoForLiveQueue';
import { CommonModule } from '@angular/common';
import { QueueAppointmentStatus } from '../../../../Enums/QueueAppointmentStatus.enum';
import { environment } from '../../../../../environments/environment';
import { IDoctorMainInfo } from '../../models/IDoctorMainInfo';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Client-Live-Queue',
  templateUrl: './Client-Live-Queue.component.html',
  imports: [CommonModule, RatingModule, FormsModule],
  styleUrls: ['./Client-Live-Queue.component.css'],
})
export class ClientLiveQueueComponent implements OnInit, OnDestroy {
  ClientService = inject(ClientService);
  cAuthService = inject(AuthService);
  srService = inject(UpdateQueueStatusSRService);
  route = inject(ActivatedRoute);

  LiveQueues: IClientLiveQueue[] = [];
  appointmentId!: number;
  shiftId!: number;
  userid: string = '';
  fullImagePath: string = '';
  doctorMainInfo: IDoctorMainInfo = {
    FullName: '',
    Specialization: '',
    Bio: '',
    Rate: 0,
    Image: '',
  };

  clientInfo!: IClientInfoForLiveQueue;

  private subscription?: Subscription;
  QueueAppointmentStatus = QueueAppointmentStatus;

  currentStep = 1;
  waitingProgress = 0;
  estimatedTime = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.appointmentId = Number(params.get('appointmentId'));
      this.shiftId = Number(params.get('shiftId'));
      this.ClientService.ClientLiveQueue(this.appointmentId).subscribe({
        next: (res) => {
          this.LiveQueues = res.Data;
          this.updateProgress();
        },
        error: (err) => {
          console.error('Error fetching live queue data:', err);
        },
      });
    });

    this.userid = this.cAuthService.getUserId();
    this.ClientService.ClientInfoForLiveQueue(this.userid).subscribe({
      next: (res) => {
        this.clientInfo = res.Data;
        console.log('Client Info:', this.clientInfo);
        this.updateProgress();
        if (this.clientInfo?.Image) {
          this.fullImagePath = `${environment.apiUrl}${this.clientInfo.Image}`;
          console.log(this.fullImagePath);
          console.log(environment.apiUrl);
        }

        if (this.shiftId) {
          this.srService.joinShiftGroup(this.shiftId);
        }
      },
      error: (err) => {
        console.error('Error fetching client info:', err);
      },
    });

    this.srService.updatedLiveQueuesList.subscribe({
      next: (updatedList) => {
        this.LiveQueues = [...updatedList];
        console.log('Updated Live Queue List:', this.LiveQueues);
        this.updateProgress();
      },
      error: (err) => {
        console.error('Error updating live queue list:', err);
      },
    });

    this.subscription = interval(5000).subscribe(() => {
      this.updateProgress();
    });

    const state = history.state;
    if (state && state.doctorMainInfo) {
      this.doctorMainInfo = state.doctorMainInfo;
      this.doctorMainInfo.Image = `${environment.apiUrl}${this.doctorMainInfo.Image}`;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();

    if (this.shiftId) {
      this.srService.leaveShiftGroup(this.shiftId);
    }
  }

  getStatusText(status: QueueAppointmentStatus): string {
    switch (status) {
      case QueueAppointmentStatus.NotChecked:
        return ' Not Checked';
      case QueueAppointmentStatus.Waiting:
        return ' Waiting';
      case QueueAppointmentStatus.InProgress:
        return 'In Consultation';
      case QueueAppointmentStatus.Completed:
        return 'Done';
      default:
        return '';
    }
  }

  getStatusClass(status: QueueAppointmentStatus): string {
    switch (status) {
      case QueueAppointmentStatus.NotChecked:
        return 'status-not-checked';
      case QueueAppointmentStatus.Waiting:
        return 'status-waiting';
      case QueueAppointmentStatus.InProgress:
        return 'status-in-progress';
      case QueueAppointmentStatus.Completed:
        return 'status-completed';
      default:
        return 'status-waiting';
    }
  }

  getFullImagePath(imageUrl: string): string {
    return `${environment.apiUrl}${imageUrl}`;
  }
  public getCurrentNumber(): number {
    const current = this.LiveQueues.find((q) => q.Status === 1);
    return current?.CurrentQueuePosition || 0;
  }
  getCurrentPosition(): number {
    const current = this.LiveQueues.find((q) => q.IsCurrentClient);
    return current?.CurrentQueuePosition || 0;
  }
  private updateProgress() {
    if (this.LiveQueues.length === 0) return;

    const me = this.LiveQueues.find((q) => q.IsCurrentClient);

    if (!me) return;

    const myNumber = me.CurrentQueuePosition;
    const currentNumber = this.getCurrentNumber();

    const total = myNumber;
    const current = currentNumber;

    this.waitingProgress = Math.min((current / total) * 100, 100);

    if (current >= 2) this.currentStep = 2;
    if (current >= myNumber) this.currentStep = 3;

    const remainingPatients = myNumber - current;
    const estimatedMinutes = remainingPatients * 15;

    if (estimatedMinutes <= 0) {
      this.estimatedTime = 'Your turn!';
    } else if (estimatedMinutes < 60) {
      this.estimatedTime = `${estimatedMinutes} minutes`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      this.estimatedTime =
        minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
    }
  }

  trackByFn(index: number, item: IClientLiveQueue): number {
    return item.CurrentQueuePosition;
  }
}

//   ClientService = inject(ClientService);
//   cAuthService = inject(AuthService);
//   srService = inject(UpdateQueueStatusSRService);
//   route = inject(ActivatedRoute);
//   LiveQueues :Array<IClientLiveQueue> = [];
//   appoinmentid!:number;
//   userid:string='';
//   clientInfo!: IClientInfoForLiveQueue;
//  private subscription?: Subscription;

//   doctorInfo = {
//     name: 'Mohamed Ahmed',
//     specialty: 'Cardiologist',
//     image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
//   };

//   statusData = {
//     myNumber: 16,
//     attendInClinic: 2,
//     currentNumber: 12
//   };

//   currentStep = 2;
//   waitingProgress = 65;
//   estimatedTime = '2 hours';

//   queueItems: QueueItem[] = [
//     {
//       id: 1,
//       name: 'Anonymous',
//       status: 'In Consultation',
//       number: 10,
//       isAnonymous: true,
//       statusSeverity: 'info'
//     },
//     {
//       id: 2,
//       name: 'Anonymous',
//       status: 'Waiting in Clinic',
//       number: 13,
//       isAnonymous: true,
//       statusSeverity: 'warning'
//     },
//     {
//       id: 3,
//       name: 'Anonymous',
//       status: 'waiting',
//       number: 14,
//       isAnonymous: true,
//       statusSeverity: 'warning'
//     },
//     {
//       id: 4,
//       name: 'Amir Nasser (Me)',
//       status: 'waiting',
//       number: 15,
//       isAnonymous: false,
//       statusSeverity: 'warning'
//     },
//     {
//       id: 5,
//       name: 'Anonymous',
//       status: 'Done',
//       number: 11,
//       isAnonymous: true,
//       statusSeverity: 'success'
//     }
//   ];

//   ngOnInit() {
//     // Simulate real-time updates
//     this.subscription = interval(5000).subscribe(() => {
//       this.simulateProgress();
//     });
//     this.route.paramMap.subscribe(params => {
//       this.appoinmentid = Number(params.get('appointmentId')); // 'id' is the parameter name from the route
//     });
//     this.userid= this.cAuthService.getUserId();
//     this.ClientService.ClientInfoForLiveQueue(this.userid).subscribe({
//       next: (res) => {
//         this.clientInfo = res.Data;
//         console.log('Client Info:', this.clientInfo);
//       }
//       ,
//       error: (err) => {
//         console.error('Error fetching doctor info:', err);
//       }
//     });

//     this.ClientService.ClientLiveQueue(this.appoinmentid).subscribe({
//       next: (res) => {
//         this.LiveQueues = res.Data;
//         console.log('Live Queue Data:', this.LiveQueues);
//       },
//       error: (err) => {
//         console.error('Error fetching live queue data:', err);
//       }
//     });
//     this.srService.updatedLiveQueuesList.subscribe({
//       next: (updatedList) => {
//         this.LiveQueues = [...updatedList];
//         console.log('Updated Live Queue List:', this.LiveQueues);
//       },
//       error: (err) => {
//         console.error('Error updating live queue list:', err);
//       }
//     })
//   }

//   ngOnDestroy() {
//     this.subscription?.unsubscribe();
//   }

//   trackByFn(index: number, item: QueueItem): number {
//     return item.id;
//   }

//   getStepClass(step: number): string {
//     return this.currentStep >= step ? 'step-active' : 'step-inactive';
//   }

//   getProgressLineClass(step: number): string {
//     return this.currentStep > step ? 'line-active' : 'line-inactive';
//   }

//   private simulateProgress() {
//     // Simulate queue progression
//     if (Math.random() > 0.7) {
//       this.statusData.currentNumber = Math.min(
//         this.statusData.currentNumber + 1,
//         this.statusData.myNumber
//       );
//       this.updateProgress();
//       this.updateQueueStatuses();
//     }
//   }

//   private updateProgress() {
//     const total = this.statusData.myNumber - this.statusData.attendInClinic;
//     const current = this.statusData.currentNumber - this.statusData.attendInClinic;
//     this.waitingProgress = Math.min((current / total) * 100, 100);

//     if (this.statusData.currentNumber >= this.statusData.attendInClinic) {
//       this.currentStep = 2;
//     }
//     if (this.statusData.currentNumber >= this.statusData.myNumber) {
//       this.currentStep = 3;
//     }

//     // Update estimated time based on progress
//     const remainingPatients = this.statusData.myNumber - this.statusData.currentNumber;
//     const estimatedMinutes = remainingPatients * 15; // 15 minutes per patient

//     if (estimatedMinutes <= 0) {
//       this.estimatedTime = 'Your turn!';
//     } else if (estimatedMinutes < 60) {
//       this.estimatedTime = `${estimatedMinutes} minutes`;
//     } else {
//       const hours = Math.floor(estimatedMinutes / 60);
//       const minutes = estimatedMinutes % 60;
//       this.estimatedTime = minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
//     }
//   }

//   private updateQueueStatuses() {
//     // Update queue item statuses based on current number
//     this.queueItems.forEach(item => {
//       if (item.number < this.statusData.currentNumber) {
//         item.status = 'Done';
//         item.statusSeverity = 'success';
//       } else if (item.number === this.statusData.currentNumber) {
//         item.status = 'In Consultation';
//         item.statusSeverity = 'info';
//       }
//     });
//   }
