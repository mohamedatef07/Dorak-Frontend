import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/ApiResponse';
import { IDoctorsCard } from '../../../types/IDoctorsCard';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingpageServiceService {
    httpClient=inject(HttpClient)


constructor() { }

  getAllDoctorsCards(): Observable<ApiResponse<IDoctorsCard[]>> {
    return this.httpClient.get<ApiResponse<IDoctorsCard[]>>(
      `${environment.apiUrl}/API/LandingPage/top-rated`);
  }

}




