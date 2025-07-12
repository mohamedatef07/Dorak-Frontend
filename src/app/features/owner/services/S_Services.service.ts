import { IAddProviderCenterService } from './../models/IAddProviderCenterService';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/ApiResponse';
import { IShiftServices } from '../models/IShiftServices';
import { environment } from '../../../../environments/environment';
import { IProviderCenterService } from '../models/IProviderCenterService';

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

  getAllProviderCenterServices(centerId: number) {
    return this.httpClient.get<{ Data: IProviderCenterService[] }>(
      `${environment.apiUrl}/api/Services/get-all-provider-center-services?centerId=${centerId}`
    );
  }

  updateProviderCenterService(PCSId: number, dto: { Price: number }) {
    const formData = new FormData();
    formData.append('Price', dto.Price.toString());
    return this.httpClient.put(
      `${environment.apiUrl}/api/Services/update-provider-center-services?PCSId=${PCSId}`,
      formData
    );
  }
}
