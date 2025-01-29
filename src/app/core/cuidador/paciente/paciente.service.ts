import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../assets/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/paciente/`;

  registerPaciente(userData: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}register`,
      userData
    );
  }
  getAllPaciente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}`);
  }
}
