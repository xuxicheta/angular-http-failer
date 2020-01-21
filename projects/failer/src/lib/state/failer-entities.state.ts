import { Injectable } from '@angular/core';
import { AbstractEntityState } from './abstract-state.class';
import { FailerRequest } from '../models';

@Injectable()
export class FailerEntitiesState extends AbstractEntityState<FailerRequest> {

  constructor() {
    super();
    super.createAll('requestId');
  }
}
