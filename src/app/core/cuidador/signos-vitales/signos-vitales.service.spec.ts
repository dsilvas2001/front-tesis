import { TestBed } from '@angular/core/testing';

import { SignosVitalesService } from './signos-vitales.service';

describe('SignosVitalesService', () => {
  let service: SignosVitalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignosVitalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
