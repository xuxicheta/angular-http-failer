import { RequestUi } from './failer-ui.interface';

export interface RequestSort {
  prop: keyof RequestUi;
  direction: number;
}
