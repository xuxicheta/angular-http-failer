import { TestBed } from '@angular/core/testing';

import { FailerHandlerService } from './failer-handler.service';

describe('FailerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FailerHandlerService = TestBed.get(FailerHandlerService);
    expect(service).toBeTruthy();
  });
});
