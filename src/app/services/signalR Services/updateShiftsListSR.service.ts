import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ICenterShifts } from '../../features/owner/models/ICenterShifts';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateShiftsListSRService {
  private hubConnection: signalR.HubConnection | null = null;
  private shiftListSubject = new Subject<Array<ICenterShifts>>();
  public updatedShiftsList = this.shiftListSubject.asObservable();

  constructor(private authService: AuthService) {
    this.startConnection();
    this.registerOnServerEvents();
  }
  private startConnection() {
    const token = this.authService.getAuthToken();

    if (!token) {
      console.warn('❗ No auth token found. SignalR connection aborted.');
      return;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/shiftListHub`, {
        accessTokenFactory: () => token,
      })
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
        'updateShiftsList',
        (updatedList: Array<ICenterShifts>) => {
          this.shiftListSubject.next(updatedList);
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
    this.shiftListSubject.complete();
  }
}
