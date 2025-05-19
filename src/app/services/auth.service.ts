import { inject, Injectable } from '@angular/core';
import { ILoginRequest } from '../types/ILoginRequest';
import { IClientRegisterRequest } from '../types/IClientRegisterRequest';
import { ApiResponse } from '../types/ApiResponse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginResponseData } from '../types/ILoginResponseData';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  cookie = inject(CookieService);
  httpClient = inject(HttpClient);

  getAuthToken() {
    return this.cookie.get('token') || '';
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  getUserRole(): string | null {
    return this.cookie.get('role') || null;
  }

  getUserId() {
    const token = this.getAuthToken();
    const tokenParts = token?.split('.');
    if (tokenParts?.length !== 3) return null;
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.Id;
  }
  register(
    registerData: IClientRegisterRequest
  ): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(
      `${environment.apiUrl}/api/account/Register`,
      registerData
    );
  }

  createClient(id: string, client: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.apiUrl}/api/account/CreateClient?id=${id}`,
      client
    );
  }

  logIn(loginData: ILoginRequest): Observable<ApiResponse<ILoginResponseData>> {
    return this.httpClient.post<ApiResponse<ILoginResponseData>>(
      `${environment.apiUrl}/api/account/login`,
      loginData
    );
  }
  logOut() {
    this.cookie.delete('token');
    return this.httpClient.post<ApiResponse<null>>(
      `${environment.apiUrl}/api/account/signout`,
      {}
    );
  }
}
