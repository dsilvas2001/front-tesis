import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PacienteService } from '../paciente/paciente.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PacienteResolver implements Resolve<any> {
  constructor(private pacienteService: PacienteService) {}

  resolve(): Observable<any> {
    return forkJoin({
      count_pacientes: this.pacienteService.getCountPaciente(),
    });
  }
}
