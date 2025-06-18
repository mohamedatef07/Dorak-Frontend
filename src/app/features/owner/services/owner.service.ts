import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../types/ApiResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IOperator } from '../models/IOperator';
import { ICreateAppointment } from '../models/ICreateAppointment';
import { IShiftsTable } from '../models/IShiftsTable';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private httpClient = inject(HttpClient);

  constructor() { }

  getOperatorsByCenterId(
    centerId: number
  ): Observable<ApiResponse<IOperator[]>> {
    return this.httpClient.get<ApiResponse<IOperator[]>>(
      `${environment.apiUrl}/api/center/OperatorstoCenter?centerId=${centerId}`
    );
  }

  addOperatorByCenterId(
    operatorData: FormData
  ): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.apiUrl}/api/account/Register`,
      operatorData
    );
  }

  deleteOperatorById(operatorId: string): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${environment.apiUrl}/api/Operator/Delete?operatorid=${operatorId}`
    );
  }

  reserveAppointment(
    appointmentData: ICreateAppointment
  ): Observable<ApiResponse<any>> {
    console.log("appointmentData From Owner Service: ",appointmentData);
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.apiUrl}/api/Operator/reserve-appointment`,
      appointmentData
    )
  }

  getShiftsDetailsforbooking(
    centerId: number
  ): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(
      `${environment.apiUrl}/api/Shift/GetAllCenterShiftsAndServices?centerId=${centerId}`
    );
  }
}
