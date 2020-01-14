import { TestBed } from '@angular/core/testing';

import { FailerService } from './failer.service';

describe('FailerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FailerService = TestBed.get(FailerService);
    expect(service).toBeTruthy();
  });
});
