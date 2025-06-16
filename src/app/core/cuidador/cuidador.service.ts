import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuidadorService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/cuidador/`;

  // Obtiene el conteo de cuidadores por centro
  getCountCuidadores(centroId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}count/${centroId}`
    );
  }

  // Obtiene los cuidadores aprobados por centro
  getAprobados(centroId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.API_PATH}aprobados/${centroId}`
    );
  }

  // Obtiene los cuidadores no aprobados por centro
  getNoAprobados(centroId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.API_PATH}no-aprobados/${centroId}`
    );
  }

  // Aprueba un cuidador por su ID
  aprobarCuidador(cuidadorId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}aprobar/${cuidadorId}`,
      null
    );
  }
}
