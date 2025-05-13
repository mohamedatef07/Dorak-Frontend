import { inject, Injectable } from '@angular/core';
import { ILoginRequest } from '../types/ILoginRequest';
import { IClientRegisterRequest } from '../types/IClientRegisterRequest';
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

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }


  getUserRole(): string | null {
    return sessionStorage.getItem('role');
  }

 register(registerData: IClientRegisterRequest): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      `${environment.apiUrl}/api/account/Register`,
      registerData
    );
  }

  createClient(id: string, client: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(`${environment.apiUrl}/api/account/CreateClient?id=${id}`, client)
  }

  logIn(loginData: ILoginRequest): Observable<ApiResponse<ILoginResponseData>> {
    return this.httpClient.post<ApiResponse<ILoginResponseData>>(
      `${environment.apiUrl}/api/account/login`,
      loginData
    );
  }
  logOut() {
    sessionStorage.removeItem('token');
    return this.httpClient.post<ApiResponse<null>>(`${environment.apiUrl}/api/account/signout`,{});
  }
}
