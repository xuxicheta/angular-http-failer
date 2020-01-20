import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { FailerComponent } from '../failer/failer.component';
import { FailerKeyBusService } from './failer-key-bus.service';
import { Subscription } from 'rxjs';

@Injectable()
export class FailerOpenerService {
  private overlayRef: OverlayRef = this.createOverlay();
  private isOpened: boolean;

  constructor(
    private overlay: Overlay,
    private failerKeyBusService: FailerKeyBusService,
  ) {
    this.initSubscription();
    if (localStorage.getItem('opened')) {
      this.open();
    }
  }

  private initSubscription(): Subscription {
    return this.failerKeyBusService.selectKeyBus()
      .subscribe(() => {
        if (this.isOpened) {
          this.close();
        } else {
          this.open();
        }
      });
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
