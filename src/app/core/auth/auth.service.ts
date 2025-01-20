import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environments/environment.prod';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/usuario/`;

  getDecodedToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  registerUser(userData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}register`,
      userData
    );
  }

  loginUser(userData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.API_PATH}auth`, userData);
  }
}
