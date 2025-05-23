import { ApiResponse } from './../../../types/ApiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IDoctorMainInfo } from '../../../types/IDoctorMainInfo';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDoctorBookingInfo } from '../../../types/IDoctorBookingInfo';
import { ICenterServices } from '../../../types/ICenterServices';
import { IDoctorReviews } from '../../../types/IDoctorReviews';
import { IClientReviews } from '../../../types/IClientReviews';
import { IDoctorsSearchResult } from '../../../types/IDoctorsSearchResult';
import { IDoctorCenterServices } from '../../../types/IDoctorCenterServices';
import { IClientProfileAppointment } from '../models/IClientProfileAppointment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpClient = inject(HttpClient);
  authServices = inject(AuthService);
  id = '92e208ca-78e0-4d86-948a-e596cdc7c365';
  constructor() {}
  getMainInfo(): Observable<ApiResponse<IDoctorMainInfo>> {
    return this.httpClient.get<ApiResponse<IDoctorMainInfo>>(
      `${environment.apiUrl}/api/client/main-info?providerId=${this.id}`
    );
  }
  getBookingInfo(): Observable<ApiResponse<IDoctorBookingInfo>> {
    return this.httpClient.get<ApiResponse<IDoctorBookingInfo>>(
      `${environment.apiUrl}/api/client/booking-info?providerId=${this.id}`
    );
  }
  getCenterServices(): Observable<ApiResponse<ICenterServices>> {
    return this.httpClient.get<ApiResponse<ICenterServices>>(
      `${environment.apiUrl}/api/client/provider-center-services?providerId=${this.id}`
    );
  }
  getDoctorReviews(): Observable<ApiResponse<Array<IDoctorReviews>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorReviews>>>(
      `${environment.apiUrl}/api/client/provider-reviews?providerId=${this.id}`
    );
  }
  getDoctorCenterServices(): Observable<
    ApiResponse<Array<IDoctorCenterServices>>
  > {
    return this.httpClient.get<ApiResponse<Array<IDoctorCenterServices>>>(
      `${environment.apiUrl}/api/client/provider-center-services?providerId=${this.id}`
    );
  }
  getDoctorBookingInfo(): Observable<
    ApiResponse<Array<IDoctorBookingInfo>>
  > {
    return this.httpClient.get<ApiResponse<Array<IDoctorBookingInfo>>>(
      `${environment.apiUrl}/api/client/booking-info?providerId=${this.id}`
    );
  }
  searchAboutDoctors(
    searchText: string,
    specialization: string,
    city: string
  ): Observable<ApiResponse<Array<IDoctorsSearchResult>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorsSearchResult>>>(
      `${environment.apiUrl}/api/client/search?searchText=${searchText}&specialization=${specialization}&city=${city}`
    );
  }

  getClientAppointments(userId:string): Observable<ApiResponse<IClientProfileAppointment>> {
    return this.httpClient.get<ApiResponse<IClientProfileAppointment>>
    (`${environment.apiUrl}/api/client/Profile-all-appointment/${userId}`);
  }
}
