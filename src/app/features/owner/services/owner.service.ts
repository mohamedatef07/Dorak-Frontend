import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../types/ApiResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IOperator } from '../models/IOperator';
import { ICreateAppointment } from '../models/ICreateAppointment';
import { IShiftsTable } from '../models/IShiftsTable';
import { ICenterShifts } from '../models/ICenterShifts';
import { AuthService } from '../../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  authServices = inject(AuthService);
  httpClient = inject(HttpClient);
  operatorId = 1 | this.authServices.getUserId();

  constructor() {}

  getOperatorsByCenterId(
    centerId: number
  ): Observable<ApiResponse<IOperator[]>> {
    return this.httpClient.get<ApiResponse<IOperator[]>>(
      `${environment.apiUrl}/api/center/OperatorstoCenter?centerId=${centerId}`
    );
  }

  addOperatorByCenterId(operatorData: FormData): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.apiUrl}/api/account/Register`,
      operatorData
    );
  }

  deleteOperatorById(operatorId: string): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${environment.apiUrl}/api/Operator/Delete?operatorId=${operatorId}`
    );
  }

  reserveAppointment(
    appointmentData: ICreateAppointment
  ): Observable<ApiResponse<any>> {
    console.log("appointmentData From Owner Service: ",appointmentData);
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.apiUrl}/api/Operator/reserve-appointment`,
      appointmentData
    );
  }

  getAllCenterShifts(
    centerId: number
  ): Observable<ApiResponse<Array<ICenterShifts>>> {
    return this.httpClient.get<ApiResponse<Array<ICenterShifts>>>(
      `${environment.apiUrl}/api/shift/get-all-center-shifts/?centerId=${centerId}`
    );
  }

  startShift(shiftId: number): Observable<ApiResponse<null>> {
    return this.httpClient.get<ApiResponse<null>>(
      `${environment.apiUrl}/api/operator/start-shift/?shiftId=${shiftId}&operatorId=${this.operatorId}`
    );
  }
  cancelShift(
    shiftId: number,
    centerId: number
  ): Observable<ApiResponse<null>> {
    return this.httpClient.get<ApiResponse<null>>(
      `${environment.apiUrl}/api/operator/cancel-shift/?shiftId=${shiftId}&centerId=${centerId}`
    );
  }

  getShiftsDetailsforbooking(
    centerId: number
  ): Observable<ApiResponse<any>>{
    return this.httpClient.get<ApiResponse<any>>(
      `${environment.apiUrl}/api/Shift/get-all-centerShifts-and-services?centerId=${centerId}`
    );
  }

}
