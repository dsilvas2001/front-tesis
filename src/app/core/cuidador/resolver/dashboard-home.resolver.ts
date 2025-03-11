import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PacienteService } from '../paciente/paciente.service';

@Injectable({ providedIn: 'root' })
export class DashboardHomeResolver implements Resolve<any> {
  constructor(private pacienteService: PacienteService) {}

  resolve(): Observable<any> {
    return forkJoin({
      count_Home: this.pacienteService.getCountALLHOME(),
    });
  }
}
