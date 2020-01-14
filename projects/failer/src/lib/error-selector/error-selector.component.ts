import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpErrorsService } from '../services/http-errors.service';
import { AbstractCVA } from '../abstract-cva.class';

@Component({
  selector: 'lib-error-selector',
  templateUrl: './error-selector.component.html',
  styleUrls: ['./error-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ErrorSelectorComponent),
    multi: true
  }]
})
export class ErrorSelectorComponent extends AbstractCVA implements ControlValueAccessor {
  public errorCode: number;
  public errorList = this.httpErrorsService.errorList;

  @Input() withCommon: boolean;

  writeValue(outsideValue: number): void {
    this.errorCode = +outsideValue;
    this.cdr.markForCheck();
  }

  updateValue(insideValue: number): void {
    this.onTouched();
    this.onChange(+insideValue);
  }

  constructor(
    private httpErrorsService: HttpErrorsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }
}
