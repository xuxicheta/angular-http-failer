import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FailerRequest } from 'failer/lib/models';
import { Observable } from 'rxjs';
import { FailerEntitiesState } from '../state/failer-entities.state';
import { FailerHandlerService } from './failer-handler.service';
import { FailerOpenerService } from './failer-opener.service';


function configureProviders(): Provider[] {
  const spyFailerEntitiesState = jasmine.createSpyObj('FailerEntitiesState', [
    'upsertEntity',
    'getEntity',
  ]);

  return [
    FailerHandlerService,
    {
      provide: FailerEntitiesState,
      useValue: spyFailerEntitiesState,
    },
    {
      provide: FailerOpenerService,
      useValue: {},
    },
  ];
}

function setup() {
  TestBed.configureTestingModule({
    providers: configureProviders(),
  });

  const failerHandlerService: FailerHandlerService = TestBed.get(FailerHandlerService);
  const failerEntitiesState: jasmine.SpyObj<FailerEntitiesState> = TestBed.get(FailerEntitiesState);

  return {
    failerHandlerService,
    failerEntitiesState,
  };
}

describe('FailerHandlerService', () => {
  it('should be created', () => {
    const { failerHandlerService } = setup();
    expect(failerHandlerService).toBeTruthy();
    expect(failerHandlerService instanceof FailerHandlerService).toBeTruthy();
  });

  it('should pass has requestHandle and its return observable', () => {
    const { failerHandlerService } = setup();

    const req = new HttpRequest('GET', 'url1');
    const response = failerHandlerService.requestHandle(req);
    expect(response instanceof Observable).toBeTruthy();
  });

  it('should pass has requestHandle and its return observable null', (done: DoneFn) => {
    const { failerHandlerService } = setup();

    const req = new HttpRequest('GET', 'url1');
    const response = failerHandlerService.requestHandle(req);

    response.subscribe(result => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should on empty stored call FailerEntitiesState#upsertEntity', (done: DoneFn) => {
    const { failerHandlerService, failerEntitiesState } = setup();
    const method = 'GET';
    const url = 'url1';
    const req = new HttpRequest(method, url);
    const response = failerHandlerService.requestHandle(req);

    const expectedRequestId = method + ' ' + url;
    const expectedFailerRequest = {
      requestId: 'GET url1',
      requestMold: {
        method: 'GET',
        url: 'url1',
        body: null,
        httpParams: '',
      },
      message: null,
      errorCode: null,
      delay: null,
    };

    response.subscribe(() => {
      expect(failerEntitiesState.upsertEntity).toHaveBeenCalledTimes(1);
      expect(failerEntitiesState.upsertEntity).toHaveBeenCalledWith(expectedRequestId, expectedFailerRequest);
      done();
    });
  });

  it('should delay on stored with delay', () => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    const { failerHandlerService, failerEntitiesState } = setup();
    const method = 'GET';
    const url = 'url1';
    const req = new HttpRequest(method, url);
    let result: any;

    const stubValue: Partial<FailerRequest> = {
      delay: 500,
      errorCode: null,
    };
    failerEntitiesState.getEntity.and.returnValue(stubValue as FailerRequest);

    const response = failerHandlerService.requestHandle(req);

    response.subscribe((v) => {
      result = v;
    });
    jasmine.clock().tick(500);
    expect(result).toBeNull();
    jasmine.clock().uninstall();
  });

  it('should return error on stored errorCode', (done: DoneFn) => {
    const { failerHandlerService, failerEntitiesState } = setup();
    const method = 'GET';
    const url = 'url1';
    const req = new HttpRequest(method, url);


    const stubValue: FailerRequest = {
      requestId: 'GET url1',
      requestMold: {
        method: 'GET',
        url: 'url1',
        body: null,
        httpParams: '',
      },
      message: 'Unknown Error',
      errorCode: 400,
      delay: null,
    };
    failerEntitiesState.getEntity.and.returnValue(stubValue);

    const expectedError = new HttpErrorResponse({
      error: 'Error induced by Failer',
      status: 400,
      statusText: 'Unknown Error',
      url: 'url1',
    });

    const response = failerHandlerService.requestHandle(req);

    response.subscribe((resultError) => {
      expect(resultError).toEqual(expectedError);
      done();
    });
  });

  it('should return delayed error', () => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    const { failerHandlerService, failerEntitiesState } = setup();
    const method = 'GET';
    const url = 'url1';
    const req = new HttpRequest(method, url);


    const stubValue: FailerRequest = {
      requestId: 'GET url1',
      requestMold: {
        method: 'GET',
        url: 'url1',
        body: null,
        httpParams: '',
      },
      message: 'Nom Nom',
      errorCode: 500,
      delay: 600,
    };
    failerEntitiesState.getEntity.and.returnValue(stubValue);

    const expectedError = new HttpErrorResponse({
      error: 'Error induced by Failer',
      status: 500,
      statusText: 'Nom Nom',
      url: 'url1',
    });
    let resultError;

    const response = failerHandlerService.requestHandle(req);

    response.subscribe((result) => {
      resultError = result;
    });
    jasmine.clock().tick(600);

    expect(resultError).toEqual(expectedError);
    jasmine.clock().uninstall();
  });
});
