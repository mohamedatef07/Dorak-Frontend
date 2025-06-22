import { Injectable } from '@angular/core';
import { INotification } from '../../features/provider/models/INotification';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class NotificationsSRService {
  private hubConnection: signalR.HubConnection | null = null;
  private notificationsListSubject = new Subject<Array<INotification>>();
  public notificationsList = this.notificationsListSubject.asObservable();
  private notificationSubject = new Subject<INotification>();
  public notification = this.notificationSubject.asObservable();

  constructor() {
    this.startConnection();
    this.registerOnServerEvents();
  }
  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/notificationHub`)
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch((err) =>
        console.error('Error while starting SignalR connection: ', err)
      );
  }
  private registerOnServerEvents() {
    if (this.hubConnection) {
      this.hubConnection.on(
        'updatedNotifications',
        (updatedNotifications: Array<INotification>) => {
          this.notificationsListSubject.next(updatedNotifications);
        }
      );

      this.hubConnection.on(
        'shiftCancellationNotification',
        (shiftCancellationNotification: INotification) => {
          this.notificationSubject.next(shiftCancellationNotification);
        }
      );

      this.hubConnection.on(
        'appointmentCancellationNotification',
        (appointmentCancellationNotification: INotification) => {
          this.notificationSubject.next(appointmentCancellationNotification);
        }
      );
    } else {
      console.warn(
        'SignalR connection not established, cannot register events.'
      );
    }
  }
  private stopConnection() {
    return this.hubConnection?.stop();
  }
  ngOnDestroy(): void {
    this.stopConnection();
    this.notificationsListSubject.complete();
    this.notificationSubject.complete();
  }
}
