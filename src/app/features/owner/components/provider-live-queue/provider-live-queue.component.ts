import { UpdateQueueStatusSRService } from '../../../../services/signalR Services/updateQueueStatusSR.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { IProviderLiveQueueViewModel } from '../../../../types/IProviderLiveQueueViewModel';
import { IUpdateQueueStatusViewModel } from '../../../../types/IUpdateQueueStatusViewModel';
import { IPaginationViewModel } from '../../../../types/IPaginationViewModel';
import { ClientType } from '../../../../../app/Enums/ClientType.enum';
import { QueueAppointmentStatus } from '../../../../../app/Enums/QueueAppointmentStatus.enum';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import * as signalR from '@microsoft/signalr';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IOperatorViewModel } from '../../../../types/IOperatorViewModel';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-provider-live-queue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-live-queue.component.html',
  styleUrls: ['./provider-live-queue.component.css'],
})
export class ProviderLiveQueueComponent implements OnInit {
  liveQueues: IProviderLiveQueueViewModel[] = [];

  // providerId: string = 'bc5edf66-098d-4fdd-82ed-44cdb6b208fa';
  centerId: number = 0;
  shiftId: number = 0;
  pageNumber: number = 1;
  pageSize: number = 16;
  totalItems: number = 0;
  providerName: string = 'Loading...';
  stats = {
    total: 0,
    normal: 0,
    consultation: 0,
    urgent: 0,
    exist: 0,
    done: 0,
  };
  showPopup: boolean = false;
  additionalFees: { [key: number]: number } = {};
  QueueAppointmentStatus = QueueAppointmentStatus; // Expose enum for template

  @ViewChild('successPopup') successPopup!: ElementRef;

  constructor(
    private apiService: ApiService,
    private signalRService: UpdateQueueStatusSRService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.centerId = this.authService.getCenterId();
    this.route.paramMap.subscribe(params => {
      this.shiftId = +params.get('shiftId')!;
      // this.loadProviderName();
      this.loadLiveQueues();
    });
    this.subscribeToQueueUpdates();
    this.checkSignalRConnection();
  }

  // loadProviderName(): void {
  //   this.apiService.getProviderById(this.providerId).subscribe({
  //     next: (response: ApiResponse<IProviderViewModel>) => {
  //       if (response.Status === 200 && response.Data) {
  //         const provider = response.Data;
  //         this.providerName = `Dr. ${provider.FirstName} ${provider.LastName} Patients`;
  //       } else {
  //         console.error('Failed to load provider name:', response.Message);
  //         this.providerName = 'Unknown Provider';
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching provider name:', error);
  //       this.providerName = 'Unknown Provider';
  //     },
  //   });
  // }

  loadLiveQueues(): void {
    this.liveQueues = [];
    this.apiService
      .getProviderLiveQueues(
        // this.providerId,
        this.centerId,
        this.shiftId,
        this.pageNumber,
        this.pageSize
      )
      .subscribe({
        next: (
          response: ApiResponse<
            IPaginationViewModel<IProviderLiveQueueViewModel>
          >
        ) => {
          if (response.Status === 200 && response.Data) {
            const normalizedData = Array.isArray(response.Data.Data)
              ? { $values: response.Data.Data }
              : response.Data.Data || { $values: [] };
            console.log('Normalized Data:', normalizedData);
            this.liveQueues = normalizedData.$values.map((item) => ({
              LiveQueueId: Number(item.LiveQueueId),
              ClientFullName: item.ClientFullName,
              ClientType: this.mapClientType(item.ClientType),
              EstimatedTime: item.EstimatedTime,
              ArrivalTime: item.ArrivalTime || '',
              Status: this.mapStatus(item.Status),
              PhoneNumber: item.PhoneNumber,
              CurrentQueuePosition: item.CurrentQueuePosition,
              AvailableStatuses: (item.AvailableStatuses || [])
                .filter(
                  (status: number) => status !== QueueAppointmentStatus.None
                )
                .map((status: number) => this.mapStatus(status)),
            }));
            this.totalItems = response.Data.Total;
            this.calculateStats();
          } else {
            console.error('Failed to load live queues:', response.Message);
            this.liveQueues = [];
            this.calculateStats();
          }
        },
        error: (error) => {
          console.error('Error fetching live queues:', error);
          this.liveQueues = [];
          this.calculateStats();
        },
      });
  }

  private calculateStats(): void {
    this.stats = {
      total: this.liveQueues.length,
      normal: this.liveQueues.filter(q => q.ClientType === ClientType.Normal).length,
      consultation: this.liveQueues.filter(q => q.ClientType === ClientType.Consultation).length,
      urgent: this.liveQueues.filter(q => this.isUrgent(q)).length,
      exist: this.liveQueues.filter(q => q.Status === QueueAppointmentStatus.InProgress || q.Status === QueueAppointmentStatus.Waiting).length,
      done: this.liveQueues.filter(q => q.Status === QueueAppointmentStatus.Completed).length,
    };
  }

  private isUrgent(queue: IProviderLiveQueueViewModel): boolean {
    return queue.ClientType !== ClientType.Normal && queue.ClientType !== ClientType.Consultation;
  }

  private mapClientType(value: number | string): ClientType {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return (numValue as ClientType) ?? ClientType.None;
  }

  private mapStatus(value: number | string): QueueAppointmentStatus {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return (numValue as QueueAppointmentStatus) ?? QueueAppointmentStatus.None;
  }

  updateQueueStatus(
    liveQueue: IProviderLiveQueueViewModel,
    event: Event
  ): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatusStr = selectElement?.value || '';

    if (!newStatusStr) {
      console.error('No status selected');
      return;
    }

    const newStatus = this.stringToStatus(newStatusStr);
    let additionalFeesValue: number | undefined = this.additionalFees[liveQueue.LiveQueueId];


    const updateModel: IUpdateQueueStatusViewModel = {
      LiveQueueId: liveQueue.LiveQueueId,
      SelectedStatus: this.getStatusString(newStatus),
      AdditionalFees: additionalFeesValue,
    };

    console.log('Update Request Payload:', updateModel);

    this.apiService.updateLiveQueueStatus(updateModel).subscribe({
      next: (response: ApiResponse<string>) => {
        if (response.Status === 200) {
          liveQueue.Status = newStatus;
          if (newStatus === QueueAppointmentStatus.Waiting) {
            liveQueue.ArrivalTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
          } else if (newStatus === QueueAppointmentStatus.Completed) {
            this.loadLiveQueues();
            console.log(this.liveQueues);
          }
          this.calculateStats();
          console.log('Queue status updated:', response.Data);
        } else {
          console.error('Error updating queue status:', response.Message);
        }
      },
      error: (error) => {
        console.error(
          'Error updating queue status:',
          error.error?.message || error.message || error
        );
      },
    });
  }

  endShift(): void {
    const operatorId = this.authService.getUserId();
    this.apiService.endShift(this.shiftId, operatorId).subscribe({
      next: (response: ApiResponse<IOperatorViewModel>) => {
        if (response.Status === 200) {
          console.log('Shift ended successfully:', response.Message);
          if (response.Data) {
            console.log('Operator data:', response.Data);
          }
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
            this.liveQueues = [];
            this.calculateStats();
            this.router.navigate(['/owner/center-shifts-table']);
          }, 3000);
        } else {
          console.error('Failed to end shift:', response.Message);
        }
      },
      error: (error) => {
        console.error('Error ending shift:', error.error?.message || error.message || error);
      },
    });
  }

  private stringToStatus(statusStr: string): QueueAppointmentStatus {
    const numValue = parseInt(statusStr, 10);
    if (!isNaN(numValue)) {
      return (
        (numValue as QueueAppointmentStatus) ?? QueueAppointmentStatus.None
      );
    }
    const statusKey = Object.keys(QueueAppointmentStatus)
      .filter((key) => isNaN(+key))
      .find((key) => key.toLowerCase() === statusStr.toLowerCase());
    return (
      QueueAppointmentStatus[
        statusKey as keyof typeof QueueAppointmentStatus
      ] ?? QueueAppointmentStatus.None
    );
  }

  getClientTypeString(type: ClientType): string {
    return ClientType[type] || 'Unknown';
  }

  getStatusString(status: QueueAppointmentStatus): string {
    return QueueAppointmentStatus[status] || 'None';
  }

  getStatusClass(status: QueueAppointmentStatus): string {
    const statusStr = this.getStatusString(status);
    switch (statusStr) {
      case 'InProgress':
        return 'InProgress';
      case 'Waiting':
        return 'Waiting';
      case 'NotChecked':
        return 'NotChecked';
      case 'Completed':
        return 'Completed';
      default:
        return '';
    }
  }

  formatTime(time: string): string {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
  }

  private subscribeToQueueUpdates() {
    this.signalRService.queueStatusUpdate.subscribe((update) => {
      const queue = this.liveQueues.find(
        (q) => q.LiveQueueId === update.liveQueueId
      );
      if (queue) {
        queue.Status = this.stringToStatus(update.newStatus);
        this.calculateStats();
      }
    });
  }

  private checkSignalRConnection() {
    setInterval(() => {
      if (
        !this.signalRService ||
        this.signalRService.getConnectionState() ===
          signalR.HubConnectionState.Disconnected
      ) {
        console.warn(
          'SignalR connection lost or not established, attempting to reconnect...'
        );
        this.signalRService.reconnectIfNeeded();
      }
    }, 5000);
  }

  addPatient(): void {
    this.router.navigate(['/owner/create-appointment']);
  }
}
