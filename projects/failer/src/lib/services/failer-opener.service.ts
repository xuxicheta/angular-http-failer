import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FailerComponent } from '../failer/failer.component';

@Injectable()
export class FailerOpenerService {
  private overlayRef: OverlayRef = this.createOverlay();
  private listener: EventListener = this.keyboardListen();

  constructor(
    private overlay: Overlay,
  ) {
    if (localStorage.getItem('opened')) {
      this.openWindow();
    }
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

  private openWindow(): ComponentRef<FailerComponent> {
    if (this.overlayRef.hasAttached()) {
      return;
    }

    const failerPortal = new ComponentPortal(FailerComponent);
    const dialogRef = this.overlayRef.attach(failerPortal);

    localStorage.setItem('opened', '1');

    return dialogRef;
  }

  private close() {
    this.overlayRef.detach();
    localStorage.removeItem('opened');
  }

  public destroy() {
    window.removeEventListener('keydown', this.listener);
  }
}
