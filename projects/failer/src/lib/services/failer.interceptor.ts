import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FailerService } from './failer.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class FailerInterceptor implements HttpInterceptor {
  constructor(
    private failerService: FailerService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.failerService.requestHandle(req).pipe(
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
