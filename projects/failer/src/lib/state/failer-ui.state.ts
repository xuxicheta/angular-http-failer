import { Injectable } from '@angular/core';
import { AbstractState } from './abstract-state.class';
import { RequestUi } from '../models';

const initialUi = (): RequestUi => ({
  method: 'any',
  url: '',
  errorCode: -2,
});

@Injectable()
export class FailerUiState extends AbstractState<RequestUi> {

  constructor() {
    super();
    this.create(initialUi());
  }
}
