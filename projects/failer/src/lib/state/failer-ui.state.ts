import { Injectable } from '@angular/core';
import { AbstractState } from './abstract-state.class';

export interface RequestUi {
  errorCode: number;
  method: string;
  url: string;
  delay?: number;
}

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
