import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { FailerKeyBusService } from './failer-key-bus.service';
import { FailerRequestsState } from './failer-requests.state';

export function initializeFailer(failerRequestsState: FailerRequestsState) {
  return () => failerRequestsState.init();
}

export const failerInitProvider: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeFailer,
  deps: [FailerRequestsState, FailerKeyBusService],
  multi: true,
};
