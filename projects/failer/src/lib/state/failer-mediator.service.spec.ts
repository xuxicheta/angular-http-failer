import { TestBed } from '@angular/core/testing';

import { FailerMediator } from './failer.mediator';

describe('FailerMediatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FailerMediator = TestBed.get(FailerMediator);
    expect(service).toBeTruthy();
  });
});
