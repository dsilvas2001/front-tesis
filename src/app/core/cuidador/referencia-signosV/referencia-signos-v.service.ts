import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReferenciaSignosVService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/referencia/`;

  registerReferenciaSignosV(userData: {
    id_paciente?: string;
    presion_arterial?: {
      sistolica_min: number;
      sistolica_max: number;
      diastolica_min: number;
      diastolica_max: number;
    };
    frecuencia_cardiaca?: {
      min: number;
      max: number;
    };
    frecuencia_respiratoria?: {
      min: number;
      max: number;
    };
    temperatura?: {
      min: number;
      max: number;
    };
  }): Observable<any> {
    console.log('userData.id_paciente');
    console.log('userData.id_paciente');
    console.log('userData.id_paciente');
    console.log('userData.id_paciente');
    console.log(userData.id_paciente);

    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}register`,
      userData
    );
  }

  updateReferencia(
    id_paciente: string,
    userData: {
      presion_arterial?: {
        sistolica_min: number;
        sistolica_max: number;
        diastolica_min: number;
        diastolica_max: number;
      };
      frecuencia_cardiaca?: {
        min: number;
        max: number;
      };
      frecuencia_respiratoria?: {
        min: number;
        max: number;
      };
      temperatura?: {
        min: number;
        max: number;
      };
    }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}update/${id_paciente} `,
      userData
    );
  }
  getAllReferencia(centroId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}${centroId}`);
  }
  getAllNotReferencia(centroId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.API_PATH}notreferencia/${centroId}`
    );
  }

  deleteReferencia(id_paciente: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}delete/${id_paciente} `,
      null
    );
  }

  getCountReferencia(centroId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}count/${centroId}`
    );
  }
}
