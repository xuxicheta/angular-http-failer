import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FailerService } from './failer.service';

@Injectable()
export class FailerInterceptor implements HttpInterceptor {
  constructor(
    private failerService: FailerService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const errorResponse = this.failerService.requestHandle(req);
    if (errorResponse) {
      return throwError(errorResponse);
    }
    return next.handle(req);
  }
}

export const failerInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FailerInterceptor,
  multi: true,
};
