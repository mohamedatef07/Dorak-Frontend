import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { INotification } from '../../features/provider/models/INotification';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsSRService {
  httpClient = inject(HttpClient);
  private hubConnection: signalR.HubConnection | null = null;
  private notificationsListSubject = new Subject<Array<INotification>>();
  public notificationsList = this.notificationsListSubject.asObservable();
  private notificationSubject = new Subject<INotification>();
  public notification = this.notificationSubject.asObservable();

  constructor(private authService: AuthService) {
    this.startConnection();
    this.registerOnServerEvents();
  }
  private startConnection() {
    const token = this.authService.getAuthToken();
    console.log('token : ',token);
    if (!token) {
      console.warn('No auth token found. SignalR connection aborted.');
      return;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/notificationHub`,{accessTokenFactory: () => token,})
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => {console.log('SignalR connection started')
        debugger
        const connectionId = this.hubConnection?.connectionId;
        this.registerUserToNotificationHub(connectionId || '');
        console.log('SignalR connection ID: ', connectionId);
      })
      .catch((err) =>
        console.error('Error while starting SignalR connection: ', err)
      );
    this.hubConnection.onreconnecting((error) => {
      console.warn('SignalR reconnecting due to error: ', error);
    });
    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected with connection ID: ', connectionId);
    });
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

 registerUserToNotificationHub(ConnectionId: string): Observable<string> {
    if (!ConnectionId) {
      console.error('Invalid connectionId.');
      return throwError(() => new Error('Invalid connectionId.'));
    }

    const url = `${environment.apiUrl}/api/Notification/RegisterUserToNotificationHub`;
    return this.httpClient
      .post<string>(url, { connectionId: ConnectionId })

  }


  ngOnDestroy(): void {
    this.stopConnection();
    this.notificationsListSubject.complete();
    this.notificationSubject.complete();
  }
}
