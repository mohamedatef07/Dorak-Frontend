import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  constructor() {}
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('').build();
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch((err) =>
        console.log(`Error establishing SignalR connection ${err}`)
      );
  }
}
