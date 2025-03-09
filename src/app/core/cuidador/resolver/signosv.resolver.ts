import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { SignosVitalesService } from '../signos-vitales/signos-vitales.service';

@Injectable({ providedIn: 'root' })
export class SignosVResolver implements Resolve<any> {
  constructor(private signosVitalesService: SignosVitalesService) {}

  resolve(): Observable<any> {
    console.log('Date.now().toLocaleString()');
    console.log('Date.now().toLocaleString()');
    console.log(Date.now().toLocaleString());
    return forkJoin({
      count_sv: this.signosVitalesService.countgetSignosV(
        new Date().toISOString()
      ),
    });
  }
}
