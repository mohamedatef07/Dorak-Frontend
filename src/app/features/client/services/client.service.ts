import { CheckoutRequest } from './../models/CheckoutRequest';
import { ApiResponse } from './../../../types/ApiResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IDoctorMainInfo } from '../models/IDoctorMainInfo';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IMakeAppointment } from '../models/IMakeAppointment';
import { IDoctorBookingInfo } from '../models/IDoctorBookingInfo';
import { ICenterServices } from '../models/ICenterServices';
import { IDoctorReviews } from '../models/IDoctorReviews';
import { IDoctorCenterServices } from '../models/IDoctorCenterServices';
import { IDoctorsSearchResult } from '../models/IDoctorsSearchResult';
import { IClientProfile } from '../models/IClientProfile';
import { IAppointment } from '../models/IAppointment';
import { IClientProfileAppointment } from '../models/IClientProfileAppointment';
import { IClientWalletProfile } from '../models/IClientWalletProfile';
import { IDoctorsCard } from '../../../types/IDoctorsCard';
import { IDoctorFilter } from '../../../types/IDoctorFilter';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpClient = inject(HttpClient);
  authServices = inject(AuthService);
  id = 'b12d8a90-7f0f-4a3d-8775-80ddd7491bd8';

  constructor() {}

  getAllDoctorsCards(): Observable<ApiResponse<IDoctorsCard[]>> {
    return this.httpClient.get<ApiResponse<IDoctorsCard[]>>(
      `${environment.apiUrl}/API/Client/cards`);
  }
  getDoctorsById(id:string):Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(
      `${environment.apiUrl}/api/Provider/GetProviderById/${id}`);
  }
searchDoctors(searchText: string = '', city: string = '', specialization: string = ''): Observable<ApiResponse<IDoctorsCard[]>> {
  const params = new HttpParams()
    .set('searchText', searchText)
    .set('city', city)
    .set('specialization', specialization);

  return this.httpClient.get<ApiResponse<IDoctorsCard[]>>(
    'http://localhost:5139/api/Client/search', { params }
  );
}

searchDoctorsByFilter(filter: IDoctorFilter) {
  return this.httpClient.post<ApiResponse<IDoctorsCard[]>>(
    'http://localhost:5139/api/Client/filter',
    filter
  );
}

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
  getDoctorBookingInfo(): Observable<ApiResponse<Array<IDoctorBookingInfo>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorBookingInfo>>>(
      `${environment.apiUrl}/api/client/booking-info?providerId=${this.id}`
    );
  }
  makeAppointment(
    reservedAppointment: IMakeAppointment
  ): Observable<IMakeAppointment> {
    return this.httpClient.post<IMakeAppointment>(
      `${environment.apiUrl}/api/client/reserve-appointment`,
      reservedAppointment
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

  getClientProfileAndAppointments(userId: string): Observable<ApiResponse<IClientProfile>> {
    return this.httpClient.get<ApiResponse<IClientProfile>>

    (`${environment.apiUrl}/api/client/profile-all-appointment/${userId}`);
  }

  getUpcomingAppointments(userId:string): Observable<ApiResponse<IClientProfileAppointment[]>> {
    return this.httpClient.get<ApiResponse<IClientProfileAppointment[]>>
    (`${environment.apiUrl}/api/client/upcoming-appointments/${userId}`);

  }
  getLastAppointment(userId:string): Observable<ApiResponse<IAppointment>> {
    return this.httpClient.get<ApiResponse<IAppointment>>
    (`${environment.apiUrl}/api/client/last-appointment/${userId}`);

  }

  Checkout(request:CheckoutRequest):Observable<CheckoutRequest >{
    return this.httpClient.post<CheckoutRequest>
    (`${environment.apiUrl}/api/client/Checkout`,request);
  }


  ClientWalletAndProfile(userId: string): Observable<ApiResponse<IClientWalletProfile>> {
    return this.httpClient.get<ApiResponse<IClientWalletProfile>>(
      `${environment.apiUrl}/api/client/client-wallet/${userId}`
    );

  }
}
