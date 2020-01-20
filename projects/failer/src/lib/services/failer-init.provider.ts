import { APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { FailerOpenerService } from './failer-opener.service';
import { FailerRequestsState } from './failer-requests.state';

export function bootstrapFailer(failerRequestsState: FailerRequestsState) {
  return () => failerRequestsState.init();
}

export const failerBootstrapProvider = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: bootstrapFailer,
  deps: [FailerRequestsState, FailerOpenerService],
};
