import { Injectable } from '@angular/core';
import { AbstractEntityState } from './abstract-state.class';

export interface RequestMold {
  url: string;
  httpParams: string;
  method: string;
  body: any;
}

export interface FailerRequest {
  errorCode: number;
  message: string;
  requestMold: RequestMold;
  requestId: string;
  delay: number;
}


@Injectable()
export class FailerEntitiesState extends AbstractEntityState<FailerRequest> {

  constructor() {
    super();
    super.createAll('requestId');
  }
}
