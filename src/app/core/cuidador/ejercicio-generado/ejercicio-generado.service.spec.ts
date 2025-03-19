import { TestBed } from '@angular/core/testing';

import { EjercicioGeneradoService } from './ejercicio-generado.service';

describe('EjercicioGeneradoService', () => {
  let service: EjercicioGeneradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjercicioGeneradoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
