import { FormGroup, FormControl } from '@angular/forms';
import { InjectionToken, FactoryProvider } from '@angular/core';

export function buildFilterForm(): FormGroup {
  const form = new FormGroup({
    method: new FormControl(),
    url: new FormControl(),
    errorCode: new FormControl(),
  });

  return form;
}

export const FAILER_FORM = new InjectionToken('FAILER_FORM');

export const failerFormProvider: FactoryProvider = {
  provide: FAILER_FORM,
  useFactory: buildFilterForm,
};
