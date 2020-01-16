import { TestBed } from '@angular/core/testing';

import { FailerOpenerService } from './failer-opener.service';

describe('FailerOpenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FailerOpenerService = TestBed.get(FailerOpenerService);
    expect(service).toBeTruthy();
  });
});
