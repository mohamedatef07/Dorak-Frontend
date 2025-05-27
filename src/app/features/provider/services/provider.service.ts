import { ApiResponse } from './../../../types/ApiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IDoctorScheduleDetails } from '../models/IDoctorScheduleDetails';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IShiftDetails } from '../models/IShiftDetails';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  httpClient = inject(HttpClient);
  authServices = inject(AuthService);
  id = '2293a1da-9c6c-4239-bde5-433abf0039f4';
  constructor() {}
  getDoctorScheduleDetails(): Observable<
    ApiResponse<Array<IDoctorScheduleDetails>>
  > {
    return this.httpClient.get<ApiResponse<Array<IDoctorScheduleDetails>>>(
      `${environment.apiUrl}/api/provider/schedule-details?providerId=${this.id}`
    );
  }
  getShiftDetails(
    shiftId: number | undefined
  ): Observable<ApiResponse<IShiftDetails>> {
    return this.httpClient.get<ApiResponse<IShiftDetails>>(
      `${environment.apiUrl}/api/provider/shift-details?shiftId=${shiftId}`
    );
  }
}
