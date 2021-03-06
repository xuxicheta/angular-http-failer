import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { FailerComponent } from '../failer/failer.component';
import { FailerKeyBusService } from './failer-key-bus.service';

@Injectable()
export class FailerOpenerService {
  private overlayRef: OverlayRef;
  private isOpened: boolean;

  constructor(
    private overlay: Overlay,
    private failerKeyBusService: FailerKeyBusService,
  ) {}

  public bootstrap(): void {
    this.overlayRef = this.createOverlay();

    this.keyListenerSubscription();
    if (localStorage.getItem('opened')) {
      this.open();
    }
  }

  private keyListenerSubscription(): Subscription {
    return this.failerKeyBusService.selectKeyBus()
      .subscribe(() => this.isOpened ? this.close() : this.open());
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'failer-overlay',
      disposeOnNavigation: true,
      positionStrategy,
    });

    const keyClose$ = overlayRef.keydownEvents().pipe(
      filter(event => event.code === 'Escape'),
      tap(event => event.preventDefault()),
    );
    const clickClose$ = overlayRef.backdropClick();

    merge(keyClose$, clickClose$)
      .subscribe(() => {
        this.close();
      });

    return overlayRef;
  }

  private open(): ComponentRef<FailerComponent> {
    if (this.overlayRef.hasAttached()) {
      return;
    }

    const failerPortal = new ComponentPortal(FailerComponent);
    const dialogRef = this.overlayRef.attach(failerPortal);

    localStorage.setItem('opened', '1');
    this.isOpened = true;

    return dialogRef;
  }

  private close() {
    this.overlayRef.detach();
    localStorage.removeItem('opened');
    this.isOpened = false;
  }
}
