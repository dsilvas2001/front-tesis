import { Resolve } from '@angular/router';
import { EjercicioPersonaService } from '../ejercicio-persona/ejercicio-persona.service';
import { forkJoin, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class EjercicioPacienteResolver implements Resolve<any> {
  constructor(private ejercicioPersonaService: EjercicioPersonaService) {}

  resolve(): Observable<any> {
    return forkJoin({
      count_ejercicioP: this.ejercicioPersonaService.getCountEjercicio(),
    });
  }
}
