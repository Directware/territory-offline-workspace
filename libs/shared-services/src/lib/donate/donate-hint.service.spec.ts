import { TestBed } from '@angular/core/testing';

import { DonateHintService } from './donate-hint.service';

describe('DonateHintService', () => {
  let service: DonateHintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonateHintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
