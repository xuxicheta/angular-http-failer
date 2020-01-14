import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { ComponentRef, Injectable } from '@angular/core';
import { filter, mapTo, switchMap, map } from 'rxjs/operators';
import { FailerRequest, FailerRequestsState, RequestMold } from './failer-requests.state';
import { FailerComponent } from '../failer/failer.component';
import { Observable, timer } from 'rxjs';

@Injectable()
export class FailerService {
  private overlayRef: OverlayRef;

  constructor(
    private failerRequestsState: FailerRequestsState,
    private overlay: Overlay,
  ) {
    this.overlayRef = this.createOverlay();
    this.keyboardListen();
    this.openWindow();
  }

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

  private keyboardListen(): EventListener {
    const keyboardListener: EventListener = (event: KeyboardEvent) => {
      if (event.code === 'KeyD' && event.ctrlKey) {
        this.openWindow();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', keyboardListener);
    return keyboardListener;
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'failer-overlay',
      disposeOnNavigation: true,
      positionStrategy,
    });

    overlayRef.keydownEvents().pipe(
      filter(event => event.code === 'Escape')
    )
      .subscribe(event => {
        event.preventDefault();
        this.close();
      });

    overlayRef.backdropClick()
      .subscribe(() => {
        this.close();
      });

    return overlayRef;
  }

  private openWindow(): ComponentRef<FailerComponent> {
    if (this.overlayRef.hasAttached()) {
      return;
    }

    const failerPortal = new ComponentPortal(FailerComponent);
    const dialogRef = this.overlayRef.attach(failerPortal);

    return dialogRef;
  }

  private close() {
    this.overlayRef.detach();
  }
}