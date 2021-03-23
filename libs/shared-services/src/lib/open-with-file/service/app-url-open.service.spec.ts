import { TestBed } from '@angular/core/testing';

import { AppUrlOpenService } from './app-url-open.service';

describe('AppUrlOpenService', () => {
  let service: AppUrlOpenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUrlOpenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
