import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/ApiResponse';
import { IPaginationViewModel } from '../types/IPaginationViewModel';
import { IProviderViewModel } from '../types/IProviderViewModel';
import { IRegistrationViewModel } from '../types/IRegistrationViewModel';
import { IProviderAssignmentViewModel } from '../types/IProviderAssignmentViewModel';
import { IWeeklyProviderAssignmentViewModel } from '../types/IWeeklyProviderAssignmentViewModel';
import { IProviderLiveQueueViewModel } from '../types/IProviderLiveQueueViewModel';
import { IUpdateQueueStatusViewModel } from '../types/IUpdateQueueStatusViewModel';
import { GenderType } from '../Enums/GenderType.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpClient = inject(HttpClient);

  getProviders(
    centerId: number,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    specializationFilter: string
  ): Observable<ApiResponse<IPaginationViewModel<IProviderViewModel>>> {
    return this.httpClient.get<ApiResponse<IPaginationViewModel<IProviderViewModel>>>(
      `${environment.apiUrl}/api/center/AllProviders?CenterId=${centerId}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&specializationFilter=${specializationFilter}`
    );
  }

  searchProviders(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    specializationFilter: string,
    searchText: string = '',
    centerId: number
  ): Observable<ApiResponse<IPaginationViewModel<IProviderViewModel>>> {
    return this.httpClient.get<ApiResponse<IPaginationViewModel<IProviderViewModel>>>(
      `${environment.apiUrl}/api/center/SearchProvider?searchText=${searchText}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&specializationFilter=${specializationFilter}¢erId=${centerId}`
    );
  }

  addProviderAndAssignIt(user: IRegistrationViewModel): Observable<string> {
    const genderMap: { [key: string]: GenderType } = {
      'none': GenderType.none,
      'Male': GenderType.Male,
      'Female': GenderType.Female
    };

    const genderValue = user.Gender ? genderMap[user.Gender] ?? GenderType.none : GenderType.none;

    const defaultBirthDate = new Date().toISOString().split('T')[0];
    let birthDateStr: string;

    if (user.BirthDate instanceof Date && !isNaN(user.BirthDate.getTime())) {
      birthDateStr = user.BirthDate.toISOString().split('T')[0];
    } else if (typeof user.BirthDate === 'string' && user.BirthDate.trim() !== '') {
      birthDateStr = user.BirthDate;
    } else {
      birthDateStr = defaultBirthDate;
    }

    const body: IRegistrationViewModel = {
      UserName: user.UserName,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Password: user.Password,
      ConfirmPassword: user.ConfirmPassword,
      Role: user.Role,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Gender: genderValue,
      BirthDate: birthDateStr,
      Street: user.Street,
      City: user.City,
      Governorate: user.Governorate,
      Country: user.Country,
      Image: user.Image,
      Specialization: user.Specialization,
      LicenseNumber: user.LicenseNumber,
      Bio: user.Bio,
      ExperienceYears: user.ExperienceYears,
      ProviderType: user.ProviderType,
      Availability: user.Availability,
      EstimatedDuration: user.EstimatedDuration,
      Rate: user.Rate
    };

    console.log('API request body:', JSON.stringify(body, null, 2));

    return this.httpClient
      .post<ApiResponse<string>>(`${environment.apiUrl}/api/center/AddProviderAndAssignIt`, body)
      .pipe(
        map((response: ApiResponse<string>) => {
          if (response.Status === 200 && response.Data && response.Data !== 'Not Valid') {
            return response.Data;
          }
          throw new Error(response.Message || 'Failed to add provider');
        })
      );
  }

  assignProviderToCenterManually(model: IProviderAssignmentViewModel): Observable<ApiResponse<string>> {
    console.log('Sending to AssignProviderToCenterManually:', JSON.stringify(model, null, 2));
    return this.httpClient.post<ApiResponse<string>>(
      `${environment.apiUrl}/api/center/AssignProviderToCenterManually`,
      model
    ).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => {
        console.error('API error in assignProviderToCenterManually:', error);
        throw error;
      })
    );
  }

  assignProviderToCenterWithWorkingDays(model: IWeeklyProviderAssignmentViewModel): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(
      `${environment.apiUrl}/api/center/AssignProviderToCenterWeekly`,
      model
    );
  }

  getProviderById(providerId: string): Observable<ApiResponse<IProviderViewModel>> {
    return this.httpClient.get<ApiResponse<IProviderViewModel>>(
      `${environment.apiUrl}/api/Provider/GetProviderById/${providerId}`
    );
  }

  getProviderAssignments(providerId: string, centerId: number): Observable<ApiResponse<any[]>> {
    return this.httpClient.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/provider/${providerId}/assignments?centerId=${centerId}`);
  }

 getProviderLiveQueues(
    providerId: string,
    centerId: number,
    shiftId: number,
    pageNumber: number = 1,
    pageSize: number = 16
  ): Observable<ApiResponse<IPaginationViewModel<IProviderLiveQueueViewModel>>> {
    return this.httpClient.get<ApiResponse<IPaginationViewModel<IProviderLiveQueueViewModel>>>(
      `${environment.apiUrl}/api/provider/GetProviderLiveQueues?providerId=${providerId}&centerId=${centerId}&shiftId=${shiftId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    ).pipe(
      map((response: ApiResponse<IPaginationViewModel<IProviderLiveQueueViewModel>>) => response),
      catchError((error) => {
        console.error('API error in getProviderLiveQueues:', error);
        throw error;
      })
    );
  }

  updateLiveQueueStatus(model: IUpdateQueueStatusViewModel): Observable<ApiResponse<string>> {
    const url = `${environment.apiUrl}/api/provider/UpdateLiveQueueStatus`;
    return this.httpClient.post<ApiResponse<string>>(url, model).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => {
        console.error('API error in updateLiveQueueStatus:', error);
        throw error;
      })
    );
  }
}
