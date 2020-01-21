import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbService } from '../indexeddb/db.service';
import { FailerRequest, RequestUi, RequestSort } from '../models';
import { FailerEntitiesState } from './failer-entities.state';
import { FailerSortState } from './failer-sort.state';
import { FailerUiState } from './failer-ui.state';


@Injectable()
export class FailerRequestsState {

  constructor(
    private dbService: DbService<FailerRequest>,
    private failerEntitiesState: FailerEntitiesState,
    private failerUiState: FailerUiState,
    private failerSortState: FailerSortState,
  ) {}

  public async init(): Promise<void> {
    const entities = await this.dbService.retreiveAll().toPromise();
    this.failerEntitiesState.setAll(entities);
  }

  public selectAllRaw(): Observable<FailerRequest[]> {
    return this.failerEntitiesState.selectAll();
  }

  public delete(requestId: string) {
    this.failerEntitiesState.deleteEntity(requestId);
    this.dbService.delete(requestId).subscribe();
  }

  public reset() {
    this.dbService.clear().subscribe();
    this.failerEntitiesState.setAll([]);
  }

  public getEntity(requestId: string): FailerRequest {
    return this.failerEntitiesState.getEntity(requestId);
  }

  public updateUi(ui: RequestUi): void {
    this.failerUiState.update(ui);
  }

  public updateSort(sort: RequestSort): void {
    this.failerSortState.update(sort);
  }

  public selectUi(): Observable<RequestUi> {
    return this.failerUiState.select();
  }

  public selectSort(): Observable<RequestSort> {
    return this.failerSortState.select();
  }

  public upsertEntity(request: Partial<FailerRequest>): void {
    this.failerEntitiesState.upsertEntity(request.requestId, request);

    this.dbService.lay(this.getEntity(request.requestId))
      .subscribe();
  }

  private filterUi(ui: RequestUi): (request: FailerRequest) => boolean {
    // tslint:disable-next-line: cyclomatic-complexity
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

  public selectAllFiltered(): Observable<FailerRequest[]> {
    return combineLatest([
      this.selectAllRaw(),
      this.selectUi(),
    ]).pipe(
      map(([entities, ui]) => entities.filter(this.filterUi(ui)))
    );
  }

  public selectAll(): Observable<FailerRequest[]> {
    return combineLatest([
      this.selectAllFiltered(),
      this.selectSort(),
    ]).pipe(
      map(([entities, sort]) => {
        if (sort.direction && sort.prop) {
          return entities.slice().sort(this.makeSortFn(sort));
        }

        return entities;
      }),
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
}
