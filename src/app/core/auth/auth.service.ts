import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/usuario/`;
  private API_PATH_CENTRO_GERONTOLOGICO = `/centro/`;

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

  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.getDecodedToken(token);
      return decodedToken ? decodedToken.email : null;
    }
    return null;
  }

  //CENTRO GERONTOLOGICO
  registerCentroGerontologico(centroGerontologicoData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH_CENTRO_GERONTOLOGICO}crear`,
      centroGerontologicoData
    );
  }
  codigoCentroGerontologico(centroGerontologicoData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH_CENTRO_GERONTOLOGICO}unirse`,
      centroGerontologicoData
    );
  }
}
