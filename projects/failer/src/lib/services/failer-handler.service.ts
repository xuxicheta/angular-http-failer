import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { FailerRequest, FailerRequestsState, RequestMold } from './failer-requests.state';
import { FailerOpenerService } from './failer-opener.service';

@Injectable()
export class FailerHandlerService {
  constructor(
    private failerRequestsState: FailerRequestsState,
    private failerOpener: FailerOpenerService, // for creation
  ) { }

  public requestHandle<T>(req: HttpRequest<T>): Observable<HttpErrorResponse> {
    const requestId = `${req.method} ${req.url}`;
    const stored: FailerRequest = this.failerRequestsState.getEntity(requestId);
    const delay = (stored && stored.delay) || 0;

    return timer(delay).pipe(
      map(() => this.requestErrorHandle(stored, requestId, req))
    );
  }

  private requestErrorHandle<T>(stored: FailerRequest, requestId: string, req: HttpRequest<T>): HttpErrorResponse {
    if (!stored) {
      this.createMold(requestId, req);
      return null;
    }

    if (!stored.errorCode) {
      return null;
    }

    if (stored.errorCode) {
      return this.createError(stored);
    }
  }

  private createError(stored: FailerRequest): HttpErrorResponse {
    console.warn('Response error by Failer at url', stored.requestId);
    return new HttpErrorResponse({
      error: 'Error induced by Failer',
      status: stored.errorCode,
      statusText: stored.message,
      url: stored.requestMold.url,
    });
  }

  private createMold<T>(requestId: string, req: HttpRequest<T>): void {
    const requestMold: RequestMold = {
      method: req.method,
      url: req.url,
      body: req.body,
      httpParams: req.params.toString(),
    };
    const failerRequest: FailerRequest = {
      requestId,
      requestMold,
      message: null,
      errorCode: null,
      delay: null,
    };
    this.failerRequestsState.upsertEntity(failerRequest);
  }
}
