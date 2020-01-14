import { Directive, ElementRef, OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[libClearer]'
})
export class ClearerDirective implements AfterViewInit, OnDestroy {
  public div;
  private sub = new Subscription();
  private listening: () => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private control: NgControl,
  ) { }

  ngAfterViewInit() {
    this.sub = this.listenControl();
  }

  ngOnDestroy() {
    this.hideX();
    this.sub.unsubscribe();
  }

  private showX() {
    const coords = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    const div = this.renderer.createElement('div');
    this.renderer.setStyle(div, 'position', 'absolute');
    this.renderer.setStyle(div, 'left', (coords.right - 20) + 'px');
    this.renderer.setStyle(div, 'top', (coords.top + 5) + 'px');
    this.renderer.setStyle(div, 'z-index', '10000');
    this.renderer.setStyle(div, 'cursor', 'pointer');
    this.listening = this.renderer.listen(div, 'click', () => {
      this.control.control.setValue(null);
    });

    const x = this.renderer.createText('x');
    this.renderer.appendChild(div, x);
    this.renderer.appendChild(document.documentElement, div);
    this.div = div;
  }

  private hideX() {
    if (this.div) {
      this.listening();
      this.renderer.removeChild(document.documentElement, this.div);
      this.renderer.destroyNode(this.div);
    }
  }

  private listenControl() {
    return this.control.control.valueChanges.pipe(
      startWith(this.control.control.value)
    )
      .subscribe(value => {
        if (value) {
          this.showX();
        } else {
          this.hideX();
        }
      });
  }

}
