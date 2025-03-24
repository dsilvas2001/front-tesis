import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EjercicioGeneradoService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/GenerateEjercicio/`;

  getEjercicioGenerado(
    categoria: string,
    numeroEjercicios: number,
    userData: {
      id_paciente: string;
      presion_arterial?: {
        sistolica: number;
        diastolica: number;
      };
      frecuencia_cardiaca?: number;
      frecuencia_respiratoria?: number;
      temperatura?: number;
    }
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}${categoria}/${numeroEjercicios}`,
      userData
    );
  }

  getRecomendaciones(body: {
    tendencia: string;
    porcentajeExito: number;
    tiempoTranscurrido: number;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}recomendaciones`,
      body
    );
  }
}
