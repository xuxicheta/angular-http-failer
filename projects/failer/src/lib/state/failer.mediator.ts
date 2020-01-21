import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FailerRequest, RequestSort, RequestUi } from '../models';
import { FailerEntitiesState } from './failer-entities.state';
import { FailerSortState } from './failer-sort.state';
import { FailerUiState } from './failer-ui.state';

@Injectable()
export class FailerMediator {

  constructor(
    private failerEntitiesState: FailerEntitiesState,
    private failerUiState: FailerUiState,
    private failerSortState: FailerSortState,
  ) { }

  private filterByFn(ui: RequestUi): (request: FailerRequest) => boolean {
    return function filterBy(request: FailerRequest): boolean {
      const condidions = [];
      if (ui.method !== 'any') {
        condidions.push(request.requestMold.method === ui.method);
      }
      if (ui.url) {
        condidions.push(request.requestMold.url.includes(ui.url));
      }

      switch (ui.errorCode) {
        case -2: // unset
          break;
        case -1: // any error
          condidions.push(!!request.errorCode);
          break;
        case 0: // no error
        case null: // no error
          condidions.push(!request.errorCode);
          break;
        default: // specified error
          condidions.push(request.errorCode === ui.errorCode);
      }

      return condidions.every(Boolean);
    };
  }

  private selectAllFiltered(): Observable<FailerRequest[]> {
    return combineLatest([
      this.failerEntitiesState.selectAll(),
      this.failerUiState.select(),
    ]).pipe(
      map(([entities, ui]) => entities.filter(this.filterByFn(ui)))
    );
  }

  private makeSortFn(sort: RequestSort) {
    if (['delay', 'errorCode'].includes(sort.prop)) {
      return (a: FailerRequest, b: FailerRequest) => {
        return (a[sort.prop] - b[sort.prop]) * sort.direction;
      };
    }
    if (['method', 'url'].includes(sort.prop)) {
      return (a: FailerRequest, b: FailerRequest) => {
        return (a.requestMold[sort.prop] as string).localeCompare(b.requestMold[sort.prop]) * sort.direction;
      };
    }
    return (a: any, b: any) => 0;
  }

  /** sorted and filtered requests */
  public selectAll(): Observable<FailerRequest[]> {
    return combineLatest([
      this.selectAllFiltered(),
      this.failerSortState.select(),
    ]).pipe(
      map(([entities, sort]) => {
        if (sort.direction && sort.prop) {
          return entities.slice().sort(this.makeSortFn(sort));
        }

        return entities;
      }),
    );
  }
}
