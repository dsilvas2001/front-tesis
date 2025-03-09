import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../assets/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EjercicioPersonaService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/ejercicioP/`;

  getEjercicio(date: string, status: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${this.API_PATH}${date}/${status}`
    );
  }
}
