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
import { AvatarModule } from 'primeng/avatar';
import { CarouselModule } from 'primeng/carousel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-Client-Live-Queue',
  templateUrl: './Client-Live-Queue.component.html',
  imports: [
    CommonModule,
    RatingModule,
    FormsModule,
    AvatarModule,
    CarouselModule,
    ProgressSpinnerModule,
  ],
  styleUrls: ['./Client-Live-Queue.component.css'],
})
export class ClientLiveQueueComponent implements OnInit, OnDestroy {
  ClientService = inject(ClientService);
  cAuthService = inject(AuthService);
  srService = inject(UpdateQueueStatusSRService);
  route = inject(ActivatedRoute);
  loading: boolean = false;
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
  imageLoadFailures: { [imageId: string]: boolean } = {};

  hasImageLoadFailed(imageId: string): boolean {
    return !!this.imageLoadFailures[imageId];
  }

  onImageError(event: Event, imageId: string) {
    this.imageLoadFailures[imageId] = true;
  }

  ngOnInit() {
    this.loading = true; // Start loading when component initializes

    // Create a counter to track completed async operations
    let completedOperations = 0;
    const totalOperations = 2; // We have 2 main API calls

    const checkLoadingComplete = () => {
      completedOperations++;
      if (completedOperations === totalOperations) {
        this.loading = false; // Stop loading when all operations are complete
      }
    };

    this.route.paramMap.subscribe((params) => {
      this.appointmentId = Number(params.get('appointmentId'));
      this.shiftId = Number(params.get('shiftId'));
      this.ClientService.ClientLiveQueue(this.appointmentId).subscribe({
        next: (res) => {
          this.LiveQueues = res.Data;
          this.updateProgress();
          checkLoadingComplete();
        },
        error: (err) => {
          console.error('Error fetching live queue data:', err);
          checkLoadingComplete();
        },
      });
    });

    this.userid = this.cAuthService.getUserId();
    this.ClientService.ClientInfoForLiveQueue(this.userid).subscribe({
      next: (res) => {
        this.clientInfo = res.Data;
        this.updateProgress();
        if (this.clientInfo?.Image) {
          this.fullImagePath = `${environment.apiUrl}${this.clientInfo.Image}`;
        }
        if (this.shiftId) {
          this.srService.joinShiftGroup(this.shiftId);
        }
        checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error fetching client info:', err);
        checkLoadingComplete();
      },
    });

    this.srService.updatedLiveQueuesList.subscribe({
      next: (updatedList) => {
        this.handleUpdatedList(updatedList);
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

  private handleUpdatedList(updatedList: IClientLiveQueue[]): void {
    // Iterate over the updatedList and change IsCurrentClient based on the AppointmentId match
    this.LiveQueues = updatedList.map((queue) => {
      // Compare AppointmentId and set IsCurrentClient based on the condition
      return {
        ...queue,
        IsCurrentClient: queue.AppointmentId === this.appointmentId,
      };
    });
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
        return 'In Progress';
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
  public getCurrentNumberForEstimatedTime(): number {
    const current = this.LiveQueues.find((q) => q.Status === 1);
    return current?.CurrentQueuePosition || 0;
  }
  public getClientCurrentNumber(): number {
    const current = this.LiveQueues.find((q) => q.Status === 3);
    return current?.CurrentQueuePosition || 0;
  }
  getClientPosition(): number {
    const current = this.LiveQueues.find((q) => q.IsCurrentClient);
    return current?.CurrentQueuePosition || 0;
  }
  private updateProgress() {
    if (this.LiveQueues.length === 0) return;

    const me = this.LiveQueues.find((q) => q.IsCurrentClient);

    if (!me) return;

    const myNumber = me.CurrentQueuePosition;
    const currentNumber = this.getCurrentNumberForEstimatedTime();

    const total = myNumber;
    const current = currentNumber;

    this.waitingProgress = Math.min((current / total) * 100, 100);

    if (current >= 2) this.currentStep = 2;
    if (current >= myNumber) this.currentStep = 3;

    const remainingPatients = myNumber - current;
    const estimatedMinutes = remainingPatients * me.EstimatedDuration;

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
