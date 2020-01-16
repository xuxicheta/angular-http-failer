import { FailerRequestsState } from './services/failer-requests.state';
import { FactoryProvider, APP_INITIALIZER } from '@angular/core';

export function initializeFailer(failerRequestsState: FailerRequestsState) {
  return () => failerRequestsState.init();
}

export const failerInitProvider: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeFailer,
  deps: [FailerRequestsState],
  multi: true,
};
