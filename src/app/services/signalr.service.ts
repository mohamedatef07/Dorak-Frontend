import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null; // Initialize with null
  public queueStatusUpdate = new Subject<{ liveQueueId: number; newStatus: string }>();

  constructor() {
    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5139/queueHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  private registerOnServerEvents() {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveQueueStatusUpdate', (liveQueueId: number, newStatus: string) => {
        this.queueStatusUpdate.next({ liveQueueId, newStatus });
      });
    } else {
      console.warn('SignalR connection not established, cannot register events.');
    }
  }


  public reconnectIfNeeded() {
    if (!this.hubConnection || this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.startConnection();
      this.registerOnServerEvents();
    }
  }
}
