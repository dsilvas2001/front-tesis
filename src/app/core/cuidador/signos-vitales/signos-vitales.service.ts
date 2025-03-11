import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignosVitalesService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/signosV/`;

  registerSignosVitales(userData: {
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
      `${this.apiUrl}${this.API_PATH}register`,
      userData
    );
  }

  updateSignosV(
    pacienteId: string,
    fecha: string,
    userData: {
      presion_arterial?: {
        sistolica: number;
        diastolica: number;
      };
      frecuencia_cardiaca?: number;
      frecuencia_respiratoria?: number;
      temperatura?: number;
    }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}update/${pacienteId}/${fecha}`,
      userData
    );
  }

  deletePaciente(pacienteId: string, fecha: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}delete/${pacienteId}/${fecha}`,
      null
    );
  }

  getAllSignosVitales(date: string, status: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.API_PATH}${date}/${status}`
    );
  }

  findByPacienteAndFecha(pacienteId: string, fecha: string): Observable<any[]> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}pacienteSV/${pacienteId}/${fecha}`
    );
  }

  countgetSignosV(fecha: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}count/todos/${fecha}`
    );
  }
}
