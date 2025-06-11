import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PacienteService } from '../paciente/paciente.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardHomeResolver implements Resolve<any> {
  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService
  ) {}

  resolve(): Observable<any> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Decodificar el token para obtener la información del centro
    const decodedToken = this.authService.getDecodedToken(token);

    if (!decodedToken?.centro_info?.id) {
      throw new Error('El usuario no tiene un centro asignado');
    }

    const centroId = decodedToken.centro_info.id;

    return forkJoin({
      count_Home: this.pacienteService.getCountALLHOME(centroId),
    });
  }
}
