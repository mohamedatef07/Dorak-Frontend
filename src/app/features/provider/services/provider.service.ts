import { ApiResponse } from './../../../types/ApiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IDoctorScheduleDetails } from '../models/IDoctorScheduleDetails';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IShiftDetails } from '../models/IShiftDetails';
import { IQueueEntries } from '../models/IQueueEntries';
import { IProviderProfile } from '../../../types/IProviderProfile';
import { IGeneralStatistics } from '../models/IGeneralStatistics';
import { INotification } from '../../../types/INotification';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  httpClient = inject(HttpClient);
  authServices = inject(AuthService);
  providerId = this.authServices.getUserId();
  constructor() {}
  getDoctorScheduleDetails(): Observable<
    ApiResponse<Array<IDoctorScheduleDetails>>
  > {
    return this.httpClient.get<ApiResponse<Array<IDoctorScheduleDetails>>>(
      `${environment.apiUrl}/api/provider/schedule-details?providerId=${this.providerId}`
    );
  }
  getShiftDetails(
    shiftId: number | undefined
  ): Observable<ApiResponse<IShiftDetails>> {
    return this.httpClient.get<ApiResponse<IShiftDetails>>(
      `${environment.apiUrl}/api/provider/shift-details?shiftId=${shiftId}`
    );
  }
  getQueueEntries(): Observable<ApiResponse<Array<IQueueEntries>>> {
    return this.httpClient.get<ApiResponse<Array<IQueueEntries>>>(
      `${environment.apiUrl}/api/provider/queue-entries?providerId=${this.providerId}`
    );
  }
  getProviderProfile(): Observable<ApiResponse<IProviderProfile>> {
    return this.httpClient.get<ApiResponse<IProviderProfile>>(
      `${environment.apiUrl}/api/Provider/provider-profile`
    );
  }

  updateProfile(
    data: FormData
  ): Observable<{ message: string; status: number; data: any }> {
    return this.httpClient.put<{ message: string; status: number; data: any }>(
      `${environment.apiUrl}/api/Provider/update-profile`,
      data
    );
  }

  updateProfileInformation(
    data: FormData
  ): Observable<{ message: string; status: number; data: any }> {
    return this.httpClient.put<{ message: string; status: number; data: any }>(
      `${environment.apiUrl}/api/Provider/update-professional-info`,
      data
    );
  }

  changePassword(
    data: FormData
  ): Observable<{ message: string; status: number; data: any }> {
    return this.httpClient.put<{ message: string; status: number; data: any }>(
      `${environment.apiUrl}/api/Account/change-password`,
      data
    );
  }
  getGeneralStatistics(): Observable<ApiResponse<IGeneralStatistics>> {
    return this.httpClient.get<ApiResponse<IGeneralStatistics>>(
      `${environment.apiUrl}/api/provider/general-statistics`
    );
  }

}
