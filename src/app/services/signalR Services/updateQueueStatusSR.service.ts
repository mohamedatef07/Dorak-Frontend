import { AuthService } from './../auth.service';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { IClientLiveQueue } from '../../features/client/models/IClientLiveQueue';
import { environment } from '../../../environments/environment';
import { IQueueEntries } from '../../features/provider/models/IQueueEntries';

@Injectable({
  providedIn: 'root',
})
export class UpdateQueueStatusSRService {
  private hubConnection: signalR.HubConnection | null = null;
  private LiveQueueListSubject = new Subject<Array<IClientLiveQueue>>();
  public updatedLiveQueuesList = this.LiveQueueListSubject.asObservable();
  private ProviderQueueSubject = new Subject<Array<IQueueEntries>>();
  public updatedProviderQueue = this.ProviderQueueSubject.asObservable();
  public queueStatusUpdate = new Subject<{
    liveQueueId: number;
    newStatus: string;
  }>();

  constructor(private authService: AuthService) {
    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    const token = this.authService.getAuthToken();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/queueHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerOnServerEvents();
      })
      .catch((err) =>
        console.error('Error while starting SignalR connection: ', err)
      );

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected');
      //this.registerOnServerEvents();
    });
    this.hubConnection.onclose(() =>
      console.log('SignalR connection closed, attempting to reconnect...')
    );
  }

  private registerOnServerEvents() {
    if (this.hubConnection) {
      this.hubConnection.on(
        'ReceiveQueueStatusUpdate',
        (liveQueueId: number, newStatus: string) => {
          this.queueStatusUpdate.next({ liveQueueId, newStatus });
        }
      );
      this.hubConnection.on('QueueUpdated', (lres: Array<IClientLiveQueue>) => {
        console.log('Live Queue Updated:', lres);
        this.LiveQueueListSubject.next(lres);
      });
      this.hubConnection.on(
        'ProviderQueueUpdated',
        (queueEntries: Array<IQueueEntries>) => {
          console.log('Provider queue updated:', queueEntries);
          this.ProviderQueueSubject.next(queueEntries);
        }
      );
    } else {
      console.warn(
        'SignalR connection not established, cannot register events.'
      );
    }
  }

  public joinShiftGroup(shiftId: number): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        ?.invoke('JoinShiftGroup', shiftId)
        .then(() => console.log(`Joined shift group: shift_${shiftId}`))
        .catch((err) => console.error('Failed to join shift group:', err));
    } else {
      console.log('SignalR connection is not connected, retrying...');
      // Retry connection or handle it
      this.reconnectIfNeeded();
      setTimeout(() => {
        if (
          this.hubConnection?.state === signalR.HubConnectionState.Connected
        ) {
          this.joinShiftGroup(shiftId); // Retry joining after reconnection
        }
      }, 1000); // Retry after 1 second
    }
  }

  public leaveShiftGroup(shiftId: number): void {
    this.hubConnection
      ?.invoke('LeaveShiftGroup', shiftId)
      .then(() => console.log(`Left shift group: shift_${shiftId}`))
      .catch((err) => console.error('Failed to leave shift group:', err));
  }

  public reconnectIfNeeded() {
    if (
      !this.hubConnection ||
      this.hubConnection.state === signalR.HubConnectionState.Disconnected
    ) {
      this.startConnection();
      this.registerOnServerEvents();
    }
  }

  public getConnectionState(): signalR.HubConnectionState {
    return this.hubConnection
      ? this.hubConnection.state
      : signalR.HubConnectionState.Disconnected;
  }

  private stopConnection() {
    return this.hubConnection?.stop();
  }
  // ngOnDestroy(): void {
  //   this.stopConnection();
  //   this.LiveQueueListSubject.complete();
  //   this.queueStatusUpdate.complete();}
  async ngOnDestroy(): Promise<void> {
    try {
      if (
        this.hubConnection &&
        this.hubConnection.state !== signalR.HubConnectionState.Disconnected
      ) {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
      }
    } catch (error) {
      console.error('Error while stopping SignalR connection:', error);
    }

    this.LiveQueueListSubject.complete();
    this.queueStatusUpdate.complete();
    this.ProviderQueueSubject.complete();
  }
}
