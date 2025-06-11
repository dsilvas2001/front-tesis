import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EjercicioPersonaService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/ejercicioP/`;

  getEjercicio(
    date: string,
    status: string,
    centroId: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.API_PATH}${date}/${status}/${centroId}`
    );
  }

  getCountEjercicio(centroId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}count/${centroId}`
    );
  }

  getSelectCategoria(userData: {
    id_paciente: string;
    presion_arterial?: {
      sistolica: number;
      diastolica: number;
    };
    frecuencia_cardiaca?: number;
    frecuencia_respiratoria?: number;
    temperatura?: number;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}select`,
      userData
    );
  }
}
