import { IAddProviderCenterService } from './../models/IAddProviderCenterService';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/ApiResponse';
import { IShiftServices } from '../models/IShiftServices';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class S_ServicesService {
  httpClient = inject(HttpClient);
  constructor() {}

  GetAllServices(): Observable<ApiResponse<IShiftServices[]>> {
    return this.httpClient.get<ApiResponse<IShiftServices[]>>(
      `${environment.apiUrl}/api/Services/get-all-services`
    );
  }

  AssignServiceToProviderCenterService(IAddProviderCenterService: IAddProviderCenterService): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.apiUrl}/api/Services/assign-service-to-provider-center-service`,
      IAddProviderCenterService
    );
  }
}
