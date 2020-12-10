import { TestBed } from '@angular/core/testing';

import { PitcherService } from './pitcher.service';

describe('PitcherService', () => {
  let service: PitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
