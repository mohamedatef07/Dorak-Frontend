import { environment } from './../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICenterShifts } from '../models/ICenterShifts';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  httpClient = inject(HttpClient);
  constructor() {}

  getAllCenterShifts(
    centerId: number
  ): Observable<ApiResponse<Array<ICenterShifts>>> {
    return this.httpClient.get<ApiResponse<Array<ICenterShifts>>>(
      `${environment.apiUrl}/api/shift/get-all-center-shifts/?centerId=${centerId}`
    );
  }
  startShift(shiftId: number): Observable<ApiResponse<null>> {
    return this.httpClient.get<ApiResponse<null>>(
      `${environment.apiUrl}/api/operator/start-shift/?shiftId=${shiftId}&operatorId=358ad212-3cb5-4819-b2c8-3d3f335f153f`
    );
  }
  cancelShift(shiftId: number): Observable<ApiResponse<null>> {
    return this.httpClient.get<ApiResponse<null>>(
      `${environment.apiUrl}/api/operator/cancel-shift/?shiftId=${shiftId}`
    );
  }
}
