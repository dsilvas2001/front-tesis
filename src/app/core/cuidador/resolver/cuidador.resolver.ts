import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CuidadorService } from '../cuidador.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CuidadorResolver implements Resolve<any> {
  constructor(
    private cuidadorService: CuidadorService,
    private authService: AuthService
  ) {}

  resolve(): any {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró token de autenticación');

    const decodedToken = this.authService.getDecodedToken(token);
    if (!decodedToken?.centro_info?.id)
      throw new Error('El usuario no tiene un centro asignado');

    const centroId = decodedToken.centro_info.id;

    return this.cuidadorService
      .getCountCuidadores(centroId)
      .toPromise()
      .then((data) => {
        return {
          count_cuidadores: data.aprobados, // Total de cuidadores
          count_pendientes: data.noAprobados, // Cuidadores pendientes
        };
      })
      .catch((error) => {
        console.error('Error en Resolver:', error);
        return null; // O devuelve valores por defecto si prefieres
      });
  }
}
