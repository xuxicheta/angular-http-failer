import { Injectable } from '@angular/core';
import { AbstractState } from './abstract-state.class';
import { RequestSort } from '../models';

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
