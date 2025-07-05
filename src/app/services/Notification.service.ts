import { inject, Injectable } from '@angular/core';
import { INotification } from '../types/INotification';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationApiResponse } from '../types/PaginationApiResponse';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  httpClient = inject(HttpClient);
  constructor() { }
  getNotifications(pageNumber: number, pageSize: number): Observable<PaginationApiResponse<Array<INotification>>> {
    return this.httpClient.get<PaginationApiResponse<Array<INotification>>>(
      `${environment.apiUrl}/api/Notification/notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
