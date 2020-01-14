import { TestBed } from '@angular/core/testing';

import { HttpErrorsService } from './http-errors.service';

describe('HttpErrorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpErrorsService = TestBed.get(HttpErrorsService);
    expect(service).toBeTruthy();
  });
});
