import { TestBed } from '@angular/core/testing';

import { EjercicioPersonaService } from './ejercicio-persona.service';

describe('EjercicioPersonaService', () => {
  let service: EjercicioPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjercicioPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
