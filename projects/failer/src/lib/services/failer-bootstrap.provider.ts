import { APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { FailerOpenerService } from './failer-opener.service';

export function bootstrapFailer(failerOpenerService: FailerOpenerService) {
  return () => failerOpenerService.bootstrap();
}

export const failerBootstrapProvider = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: bootstrapFailer,
  deps: [ FailerOpenerService],
};
