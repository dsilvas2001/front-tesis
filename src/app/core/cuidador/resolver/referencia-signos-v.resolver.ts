import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ReferenciaSignosVService } from '../referencia-signosV/referencia-signos-v.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReferenciaSignosVResolver implements Resolve<any> {
  constructor(private referenciaSignosVService: ReferenciaSignosVService) {}

  resolve(): Observable<any> {
    return forkJoin({
      count_referencias: this.referenciaSignosVService.getCountReferencia(),
    });
  }
}
