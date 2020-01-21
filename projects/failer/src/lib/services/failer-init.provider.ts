import { APP_INITIALIZER } from '@angular/core';
import { FailerEntitiesState } from '../state/failer-entities.state';

export function initFailer(failerEntitiesState: FailerEntitiesState) {
  return () => failerEntitiesState.init();
}

export const failerInitProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: initFailer,
  deps: [FailerEntitiesState],
};
