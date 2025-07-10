import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/ApiResponse';
import { environment } from '../../../../environments/environment';
import { IProviderDropDown } from '../models/IProviderDropDown';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
httpClient = inject(HttpClient);
constructor() { }
 getProvidersDropDown(
    centerId: number,
  ): Observable<ApiResponse<IProviderDropDown[]>> {
    return this.httpClient.get<ApiResponse<IProviderDropDown[]>>(
      `${environment.apiUrl}/api/center/AllProvidersDropDown?centerId=${centerId}`
    );
  }
}
