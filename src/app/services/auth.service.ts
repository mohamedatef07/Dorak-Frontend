import { inject, Injectable } from '@angular/core';
import { ILoginRequest } from '../types/ILoginRequest';
import { ApiResponse } from '../types/ApiResponse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginResponseData } from '../types/ILoginResponseData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getAuthToken() {
    return sessionStorage.getItem('token') || '';
  }
  httpClient = inject(HttpClient);
  logIn(loginData: ILoginRequest): Observable<ApiResponse<ILoginResponseData>> {
    return this.httpClient.post<ApiResponse<ILoginResponseData>>(
      `${environment.apiUrl}/api/account/login`,
      loginData
    );
  }
  logOut() {
    sessionStorage.removeItem('token');
  }
}
