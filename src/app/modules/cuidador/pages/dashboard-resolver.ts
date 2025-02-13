import { Injectable } from '@angular/core';
import { PacienteService } from '../../../core/cuidador/paciente/paciente.service';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ReferenciaSignosVService } from '../../../core/cuidador/referencia-signosV/referencia-signos-v.service';

@Injectable({ providedIn: 'root' })
export class DashboardResolver implements Resolve<any> {
  constructor(
    private pacienteService: PacienteService,
    private referenciaSignosVService: ReferenciaSignosVService
  ) {}

  resolve(): Observable<any> {
    return forkJoin({
      count_pacientes: this.pacienteService.getCountPaciente(),
      count_referencias: this.referenciaSignosVService.getCountReferencia(),
    });
  }
}
