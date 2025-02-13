import { TestBed } from '@angular/core/testing';

import { ReferenciaSignosVService } from './referencia-signos-v.service';

describe('ReferenciaSignosVService', () => {
  let service: ReferenciaSignosVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenciaSignosVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
