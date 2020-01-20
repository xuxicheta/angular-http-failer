import { Injectable } from '@angular/core';
import { RequestUi } from './failer-ui.state';
import { AbstractState } from './abstract-state.class';

export interface RequestSort {
  prop: keyof RequestUi;
  direction: number;
}

const initialSort = (): RequestSort => ({
  prop: null,
  direction: 0,
});

@Injectable()
export class FailerSortState extends AbstractState<RequestSort> {

  constructor() {
    super();
    this.create(initialSort());
  }
}
