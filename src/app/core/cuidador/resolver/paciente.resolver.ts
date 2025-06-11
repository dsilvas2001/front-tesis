import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PacienteService } from '../paciente/paciente.service';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PacienteResolver implements Resolve<any> {
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
    console.log('Centro ID:', centroId);

    // Pasar el centroId al servicio
    return forkJoin({
      count_pacientes: this.pacienteService.getCountPaciente(centroId),
    });
  }
}
