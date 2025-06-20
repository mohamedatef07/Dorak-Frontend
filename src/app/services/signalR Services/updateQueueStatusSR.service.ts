import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { IClientLiveQueue } from '../../features/client/models/IClientLiveQueue';

@Injectable({
  providedIn: 'root',
})
export class UpdateQueueStatusSRService {
    private hubConnection: signalR.HubConnection | null = null;
    private LiveQueueListSubject = new Subject<Array<IClientLiveQueue>>();
    public updatedLiveQueuesList = this.LiveQueueListSubject.asObservable();
  public queueStatusUpdate = new Subject<{
    liveQueueId: number;
    newStatus: string;
  }>();

  constructor() {
    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5139/queueHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch((err) =>
        console.error('Error while starting SignalR connection: ', err)
      );

    this.hubConnection.onreconnected(() => console.log('SignalR reconnected'));
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
      this.hubConnection.on(
        'QueueUpdated',
        (lres: Array<IClientLiveQueue>) => {
          console.log('Live Queue Updated:', lres);
          this.LiveQueueListSubject.next(lres);
        }
      );
    } else {
      console.warn(
        'SignalR connection not established, cannot register events.'
      );
    }
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
  ngOnDestroy(): void {
    this.stopConnection();
    this.LiveQueueListSubject.complete();
    this.queueStatusUpdate.complete();}
}
