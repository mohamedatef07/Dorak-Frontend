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
import { IOperatorViewModel } from '../types/IOperatorViewModel';
import { IShift } from '../types/IShift';

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
      `${environment.apiUrl}/api/center/SearchProvider?searchText=${searchText}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&specializationFilter=${specializationFilter}&centerId=${centerId}`
    );
  }

  addProviderAndAssignIt(user: IRegistrationViewModel): Observable<string> {
    const genderMap: { [key: string]: GenderType } = {
      'none': GenderType.None,
      'Male': GenderType.Male,
      'Female': GenderType.Female
    };

    const genderValue = user.Gender ? genderMap[user.Gender] ?? GenderType.None : GenderType.None;

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

  getShifts(date: Date, centerId: number): Observable<ApiResponse<IShift[]>> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateOnly = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.httpClient.get<ApiResponse<IShift[]>>(`${environment.apiUrl}/api/shift/get-shifts?date=${dateOnly}&centerId=${centerId}`);
  }

  getAllProviderAssignments(providerId: string): Observable<ApiResponse<any[]>> {
    return this.httpClient.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/provider/${providerId}/all-assignments`);
  }

  getAllShifts(date: Date, providerId: string): Observable<ApiResponse<IShift[]>> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateOnly = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.httpClient.get<ApiResponse<IShift[]>>(`${environment.apiUrl}/api/shift/get-all-shifts?date=${dateOnly}&providerId=${providerId}`);
  }

  getProviderLiveQueues(
    providerId: string,
    centerId: number,
    shiftId: number,
    pageNumber: number = 1,
    pageSize: number = 16
  ): Observable<ApiResponse<IPaginationViewModel<IProviderLiveQueueViewModel>>> {
    return this.httpClient.get<ApiResponse<IPaginationViewModel<IProviderLiveQueueViewModel>>>(
      `${environment.apiUrl}/api/operator/GetProviderLiveQueues?providerId=${providerId}&centerId=${centerId}&shiftId=${shiftId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    ).pipe(
      map((response: ApiResponse<IPaginationViewModel<IProviderLiveQueueViewModel>>) => response),
      catchError((error) => {
        console.error('API error in getProviderLiveQueues:', error);
        throw error;
      })
    );
  }

  updateLiveQueueStatus(model: IUpdateQueueStatusViewModel): Observable<ApiResponse<string>> {
    const url = `${environment.apiUrl}/api/operator/UpdateLiveQueueStatus`;
    return this.httpClient.post<ApiResponse<string>>(url, model).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => {
        console.error('API error in updateLiveQueueStatus:', error);
        throw error;
      })
    );
  }

  endShift(shiftId: number, operatorId: string): Observable<ApiResponse<IOperatorViewModel>> {
    return this.httpClient.get<ApiResponse<IOperatorViewModel>>(
      `${environment.apiUrl}/api/operator/end-shift/?shiftId=${shiftId}&operatorId=${operatorId}`
    ).pipe(
      map((response: ApiResponse<IOperatorViewModel>) => response),
      catchError((error) => {
        console.error('API error in endShift:', error);
        throw error;
      })
    );
  }
}
