import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/paciente/`;
  private API_PATH_USER = `/usuario/`;

  registerPaciente(userData: {
    nombre: string;
    apellido: string;
    edad: string;
    genero: string;
    roles: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH}register`,
      userData
    );
  }

  updatePaciente(
    pacienteId: string,
    userData: {
      nombre: string;
      apellido: string;
      edad: string;
      genero: string;
      roles: string;
    }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}update/${pacienteId} `,
      userData
    );
  }

  deletePaciente(pacienteId: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}delete/${pacienteId} `,
      null
    );
  }

  getAllPaciente(centroId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}/${centroId}`);
  }
  getCountPaciente(centroId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}count/${centroId}`
    );
  }
  getCountALLHOME(centroId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH_USER}countHome/${centroId}`
    );
  }
}
