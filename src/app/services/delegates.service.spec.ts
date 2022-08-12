import { TestBed } from '@angular/core/testing';

import { DelegatesService } from './delegates.service';

describe('DelegatesService', () => {
  let service: DelegatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelegatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
