import { Injectable } from '@angular/core';
import { PacienteService } from '../../../core/cuidador/paciente/paciente.service';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardResolver implements Resolve<any> {
  constructor(private pacienteService: PacienteService) {}
  // resolve(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<any> | Promise<any> | any {
  //   return this.pacienteService.getCountPaciente();
  // }

  resolve(): Observable<any> {
    return forkJoin({
      count_pacientes: this.pacienteService.getCountPaciente(),
      // courses: this.authServices.getCountCourses(),
    });
  }
}
