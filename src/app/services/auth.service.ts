import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5139/api/account';

  constructor(private http: HttpClient) {}

  createClient(id: string, client: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateClient?id=${id}`, client);
  }
}
