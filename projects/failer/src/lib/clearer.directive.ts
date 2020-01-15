import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

/** @dynamic */
@Directive({
  selector: '[libClearer]',
  providers: [
    {
      provide: DOCUMENT,
      useValue: document,
    },
  ]
})
export class ClearerDirective implements AfterViewInit, OnDestroy {
  public button: HTMLDivElement;
  private sub = new Subscription();

  @HostListener('window:resize')
  onResize() {
    this.positionX();
  }

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private control: NgControl,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngAfterViewInit() {
    this.sub = this.listenControl();
  }

  ngOnDestroy() {
    this.deleteX();
    this.sub.unsubscribe();
  }

  private createX(): void {
    if (this.button) {
      return;
    }
    const button = this.renderer.createElement('div');

    this.renderer.listen(button, 'click', () => {
      this.control.control.setValue(null);
    });

    this.renderer.setStyle(button, 'position', 'absolute');
    this.renderer.setStyle(button, 'left', '0');
    this.renderer.setStyle(button, 'top', '0');
    this.renderer.setStyle(button, 'z-index', '1001');
    this.renderer.setStyle(button, 'cursor', 'pointer');

    this.renderer.appendChild(button, this.renderer.createText('⨯'));
    this.renderer.appendChild(this.document.documentElement, button);

    this.button = button;
  }

  private deleteX(): void {
    if (this.button) {
      this.renderer.removeChild(this.document.documentElement, this.button);
      this.renderer.destroyNode(this.button);
      this.button = null;
    }
  }

  private positionX(): void {
    if (!this.button) {
      return;
    }
    const coords = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.button, 'transform', `translate(${coords.right - 20}px, ${coords.top + 5}px)`);
  }

  private listenControl(): Subscription {
    return this.control.control.valueChanges.pipe(
      startWith(this.control.control.value)
    )
      .subscribe(value => {
        if (value) {
          this.createX();
          this.positionX();
        } else {
          this.deleteX();
        }
      });
  }

}
