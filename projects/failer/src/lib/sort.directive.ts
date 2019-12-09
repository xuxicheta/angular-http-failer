import { Directive, ElementRef, Renderer2, OnInit, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[libSort]'
})
export class SortDirective implements OnInit {
  @Output() sort = new EventEmitter();
  private nextValue = this.createNextValueFn();
  private box: HTMLSpanElement;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) { }

  @HostBinding('style.cursor') cursor = 'pointer';

  @HostListener('click')
  onClick() {
    this.renderer.setStyle(this.box, 'opacity', '1');
    const value = this.nextValue();
    this.sort.emit(value);

    switch (value) {
      case null:
        this.renderer.setStyle(this.box, 'opacity', '0');
        setTimeout(() => this.renderer.setStyle(this.box, 'transform', 'rotate(0deg)'), 200);
        break;
      case 1:
        this.renderer.setStyle(this.box, 'transform', 'rotate(0deg)');
        break;
      case -1:
        this.renderer.setStyle(this.box, 'transform', 'rotate(180deg)');
    }
  }

  ngOnInit() {
    this.box = this.createBox(this.el.nativeElement);
    this.createArrow(this.box);
  }

  private createBox(parent: Element) {
    const box = this.renderer.createElement('span');
    this.renderer.setStyle(box, 'display', 'inline-block');
    this.renderer.setStyle(box, 'width', '1em');
    this.renderer.setStyle(box, 'height', '1em');
    this.renderer.setStyle(box, 'position', 'relative');
    this.renderer.setStyle(box, 'cursor', 'pointer');
    this.renderer.setStyle(box, 'opacity', '0');
    this.renderer.setStyle(box, 'transition', 'all 0.2s ease');

    this.renderer.appendChild(parent, box);
    return box;
  }

  private createArrow(parent: Element) {
    const arrow = this.renderer.createElement('span');
    this.renderer.setStyle(arrow, 'width', '0');
    this.renderer.setStyle(arrow, 'height', '0');
    this.renderer.setStyle(arrow, 'border', '4px solid transparent');
    this.renderer.setStyle(arrow, 'border-top', '0');
    this.renderer.setStyle(arrow, 'border-bottom-color', 'black');
    this.renderer.setStyle(arrow, 'left', 'calc(0.5em - 4px)');
    this.renderer.setStyle(arrow, 'position', 'absolute');

    this.renderer.appendChild(parent, arrow);
    return arrow;
  }

  private createNextValueFn() {
    const iterator = (function*() {
      while (true) {
        yield 1;
        yield - 1;
        yield null;
      }
    })();

    return () => iterator.next().value;
  }
}
