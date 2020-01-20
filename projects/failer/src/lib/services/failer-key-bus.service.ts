import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

/** @dynamic */
@Injectable()
export class FailerKeyBusService {
  private keyBus$ = new Subject();
  private listener = this.keyboardListen();

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {}

  private keyboardListen(): EventListener {
    const keyboardListener: EventListener = (event: KeyboardEvent) => {
      if (event.code === 'KeyQ' && event.ctrlKey) {
        this.keyBus$.next();
        event.preventDefault();
      }
    };

    this.document.addEventListener('keydown', keyboardListener);
    return keyboardListener;
  }

  public selectKeyBus() {
    return this.keyBus$.asObservable();
  }

  public destroy() {
    this.keyBus$.complete();
    this.document.removeEventListener('keydown', this.listener);
  }
}
