import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../types/ApiResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { IOperator } from '../../../types/IOperator';
import { IAddOperator } from '../../../types/IAddOperator';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private httpClient = inject(HttpClient);
  id = 1;

  constructor() { }
  getOperatorsByCenterId(centerId: number): Observable<ApiResponse<IOperator[]>> {
    return this.httpClient.get<ApiResponse<IOperator[]>>(
      `${environment.apiUrl}/api/center/OperatorstoCenter?centerId=${centerId}`
    );
  }

  addOperatorByCenterId(centerId:number):Observable<ApiResponse<IAddOperator>>{
    return this.httpClient.post<ApiResponse<IAddOperator>>(
      `${environment.apiUrl}/api/Account/Register`
    );
  }
}