import { Resolve } from '@angular/router';
import { EjercicioPersonaService } from '../ejercicio-persona/ejercicio-persona.service';
import { forkJoin, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
@Injectable({ providedIn: 'root' })
export class EjercicioPacienteResolver implements Resolve<any> {
  constructor(
    private ejercicioPersonaService: EjercicioPersonaService,
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
      count_ejercicioP:
        this.ejercicioPersonaService.getCountEjercicio(centroId),
    });
  }
}
