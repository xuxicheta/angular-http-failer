import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FailerHandlerService } from './failer-handler.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class FailerInterceptor implements HttpInterceptor {
  constructor(
    private failerHandlerService: FailerHandlerService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.failerHandlerService.requestHandle(req).pipe(
      switchMap(errorResponse => errorResponse
        ? throwError(errorResponse)
        : next.handle(req))
    );
  }
}

export const failerInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FailerInterceptor,
  multi: true,
};
