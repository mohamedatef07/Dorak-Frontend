import { inject, Injectable } from '@angular/core';
import { INotification } from '../types/INotification';
import { ApiResponse } from '../types/ApiResponse';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  httpClient = inject(HttpClient);
  constructor() { }
  getNotifications(): Observable<ApiResponse<Array<INotification>>> {
    return this.httpClient.get<ApiResponse<Array<INotification>>>(
      `${environment.apiUrl}/api/Notification/notifications`
    );
  }
}
