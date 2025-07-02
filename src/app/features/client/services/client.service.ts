import { ICheckoutRequest } from '../models/ICheckoutRequest';
import { ApiResponse } from './../../../types/ApiResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IDoctorMainInfo } from '../models/IDoctorMainInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IMakeAppointment } from '../models/IMakeAppointment';
import { IDoctorBookingInfo } from '../models/IDoctorBookingInfo';
import { ICenterServices } from '../models/ICenterServices';
import { IDoctorReviews } from '../models/IDoctorReviews';
import { IDoctorCenterServices } from '../models/IDoctorCenterServices';
import { IDoctorsSearchResult } from '../models/IDoctorsSearchResult';
import { IClientProfile } from '../models/IClientProfile';
import { IAppointment } from '../models/IAppointment';
import { IClientAppointmentCard } from '../models/IClientAppointmentCard';
import { IClientWalletProfile } from '../models/IClientWalletProfile';
import { IDoctorFilter } from '../../../types/IDoctorFilter';
import { IClientLiveQueue } from '../models/IClientLiveQueue';
import { IClientInfoForLiveQueue } from '../models/IClientInfoForLiveQueue';
import { IClientUpdate } from '../models/IClientUpdate';
import { IDoctorCard } from '../models/IDoctorCard';
import { INotification } from '../../../types/INotification';
import { IGeneralAppointmentStatistics } from '../models/IGeneralAppointmentStatistics';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpClient = inject(HttpClient);
  authServices = inject(AuthService);

  constructor() {}

  getAllDoctorsCards(): Observable<ApiResponse<Array<IDoctorCard>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorCard>>>(
      `${environment.apiUrl}/API/Client/cards`
    );
  }

  getDoctorsById(id: string | null): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${environment.apiUrl}/api/Provider/GetProviderById/${id}`
    );
  }
  searchDoctors(
    searchText: string = '',
    city: string = '',
    specialization: string = ''
  ): Observable<ApiResponse<Array<IDoctorCard>>> {
    const params = new HttpParams()
      .set('searchText', searchText)
      .set('city', city)
      .set('specialization', specialization);
    return this.httpClient.get<ApiResponse<Array<IDoctorCard>>>(
      'http://localhost:5139/api/Client/search',
      { params }
    );
  }
  searchDoctorsByFilter(filter: IDoctorFilter) {
    return this.httpClient.post<ApiResponse<Array<IDoctorCard>>>(
      'http://localhost:5139/api/Client/filter',
      filter
    );
  }

  getMainInfo(providerId: string): Observable<ApiResponse<IDoctorMainInfo>> {
    return this.httpClient.get<ApiResponse<IDoctorMainInfo>>(
      `${environment.apiUrl}/api/client/main-info?providerId=${providerId}`
    );
  }

  getBookingInfo(
    providerId: string
  ): Observable<ApiResponse<IDoctorBookingInfo>> {
    return this.httpClient.get<ApiResponse<IDoctorBookingInfo>>(
      `${environment.apiUrl}/api/client/booking-info?providerId=${providerId}`
    );
  }
  getCenterServices(
    providerId: string
  ): Observable<ApiResponse<ICenterServices>> {
    return this.httpClient.get<ApiResponse<ICenterServices>>(
      `${environment.apiUrl}/api/client/provider-center-services?providerId=${providerId}`
    );
  }
  getDoctorReviews(
    providerId: string
  ): Observable<ApiResponse<Array<IDoctorReviews>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorReviews>>>(
      `${environment.apiUrl}/api/client/provider-reviews?providerId=${providerId}`
    );
  }
  getDoctorCenterServices(
    providerId: string
  ): Observable<ApiResponse<Array<IDoctorCenterServices>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorCenterServices>>>(
      `${environment.apiUrl}/api/client/provider-center-services?providerId=${providerId}`
    );
  }
  getDoctorBookingInfo(
    providerId: string
  ): Observable<ApiResponse<Array<IDoctorBookingInfo>>> {
    return this.httpClient.get<ApiResponse<Array<IDoctorBookingInfo>>>(
      `${environment.apiUrl}/api/client/booking-info?providerId=${providerId}`
    );
  }
  makeAppointment(
    reservedAppointment: IMakeAppointment
  ): Observable<ApiResponse<ICheckoutRequest>> {
    return this.httpClient.post<ApiResponse<ICheckoutRequest>>(
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

  getClientProfileAndAppointments(
    userId: string
  ): Observable<ApiResponse<IClientProfile>> {
    return this.httpClient.get<ApiResponse<IClientProfile>>(
      `${environment.apiUrl}/api/client/profile-all-appointment/${userId}`
    );
  }

  getUpcomingAppointments(
    userId: string
  ): Observable<ApiResponse<IClientAppointmentCard[]>> {
    return this.httpClient.get<ApiResponse<IClientAppointmentCard[]>>(
      `${environment.apiUrl}/api/client/upcoming-appointments/${userId}`
    );
  }
  getLastAppointment(userId: string): Observable<ApiResponse<IAppointment>> {
    return this.httpClient.get<ApiResponse<IAppointment>>(
      `${environment.apiUrl}/api/client/last-appointment/${userId}`
    );
  }
  getAppointmentById(
    appointmentId: number
  ): Observable<ApiResponse<IAppointment>> {
    return this.httpClient.get<ApiResponse<IAppointment>>(
      `${environment.apiUrl}/api/client/appointment/${appointmentId}`
    );
  }

  getClientProfile(): Observable<ApiResponse<IClientUpdate>> {
    return this.httpClient.get<ApiResponse<IClientUpdate>>(
      `${environment.apiUrl}/api/client/ClientProfile`
    );
  }

  updateProfile(
    data: FormData
  ): Observable<{ message: string; status: number; data: any }> {
    return this.httpClient.post<{ message: string; status: number; data: any }>(
      `${environment.apiUrl}/api/client/UpdateProfile`,
      data
    );
  }

  Checkout(request: ICheckoutRequest): Observable<ICheckoutRequest> {
    return this.httpClient.post<ICheckoutRequest>(
      `${environment.apiUrl}/api/client/Checkout`,
      request
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

  ClientWalletAndProfile(
    userId: string
  ): Observable<ApiResponse<IClientWalletProfile>> {
    return this.httpClient.get<ApiResponse<IClientWalletProfile>>(
      `${environment.apiUrl}/api/client/client-wallet/${userId}`
    );
  }

  ClientLiveQueue(
    appointmentId: number
  ): Observable<ApiResponse<Array<IClientLiveQueue>>> {
    return this.httpClient.get<ApiResponse<Array<IClientLiveQueue>>>(
      `${environment.apiUrl}/api/client/queue/by-appointment/${appointmentId}`
    );
  }

  ClientInfoForLiveQueue(
    userId: string
  ): Observable<ApiResponse<IClientInfoForLiveQueue>> {
    return this.httpClient.get<ApiResponse<IClientInfoForLiveQueue>>(
      `${environment.apiUrl}/api/client/profile-for-live-queue/${userId}`
    );
  }
  getNotifications(): Observable<ApiResponse<Array<INotification>>> {
    return this.httpClient.get<ApiResponse<Array<INotification>>>(
      `${environment.apiUrl}/api/client/notifications`
    );
  }
  getGeneralAppointmentStatistics(): Observable<
    ApiResponse<IGeneralAppointmentStatistics>
  > {
    return this.httpClient.get<ApiResponse<IGeneralAppointmentStatistics>>(
      `${environment.apiUrl}/api/client/client-general-appointment-statistics`
    );
  }
}
