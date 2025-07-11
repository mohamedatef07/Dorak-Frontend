import { IDoctorCard } from './../models/IDoctorCard';
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
import { IGeneralAppointmentStatistics } from '../models/IGeneralAppointmentStatistics';
import { PaginationApiResponse } from '../../../types/PaginationApiResponse';
import { ICitiesAndSpecializations } from '../models/ICitiesAndSpecializations';
import { IClientReview } from '../models/IClientReview';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpClient = inject(HttpClient);
  authServices = inject(AuthService);

  constructor() {}

  /**
   * Get all doctors, or filter/search if filter is provided.
   * @param filter Optional filter/search object
   */
  getAllDoctorsCards(
    filter: Partial<IDoctorFilter> = {},
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationApiResponse<Array<IDoctorCard>>> {
    if (!filter || Object.keys(filter).length === 0) {
      return this.httpClient.post<PaginationApiResponse<Array<IDoctorCard>>>(
        `${environment.apiUrl}/api/Client/provider-cards`,
        filter || {},
        {
          params: new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize),
        }
      );
    } else {
      return this.httpClient.post<PaginationApiResponse<Array<IDoctorCard>>>(
        `${environment.apiUrl}/api/Client/provider-cards`,
        filter,
        {
          params: new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize),
        }
      );
    }
  }

  getDoctorsById(id: string | null): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${environment.apiUrl}/api/Provider/GetProviderById/${id}`
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
      `${environment.apiUrl}/api/client/profile/${userId}`
    );
  }

  getUpcomingAppointments(
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationApiResponse<IClientAppointmentCard[]>> {
    return this.httpClient.get<PaginationApiResponse<IClientAppointmentCard[]>>(
      `${environment.apiUrl}/api/client/upcoming-appointments/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
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
  getGeneralAppointmentStatistics(): Observable<
    ApiResponse<IGeneralAppointmentStatistics>
  > {
    return this.httpClient.get<ApiResponse<IGeneralAppointmentStatistics>>(
      `${environment.apiUrl}/api/client/client-general-appointment-statistics`
    );
  }
  cancelAppointment(appointmentId: number): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      `${environment.apiUrl}/api/client/cancel-appointment/?appointmentId=${appointmentId}`,
      {}
    );
  }

  getAppointmentsHistory(
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationApiResponse<IClientAppointmentCard[]>> {
    return this.httpClient.get<PaginationApiResponse<IClientAppointmentCard[]>>(
      `${environment.apiUrl}/api/client/appointments-history/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  GetAllCitiesAndSpecializations(): Observable<
    ApiResponse<ICitiesAndSpecializations>
  > {
    return this.httpClient.get<ApiResponse<ICitiesAndSpecializations>>(
      `${environment.apiUrl}/api/client/all-cities-specializations`
    );
  }
  getClientReviews(
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationApiResponse<IClientReview[]>> {
    return this.httpClient.get<PaginationApiResponse<IClientReview[]>>(
      `${environment.apiUrl}/api/client/client-reviews/?clientId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
