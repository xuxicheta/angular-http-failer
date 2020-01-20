import { ArrayDataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DbService } from '../indexeddb/db.service';

export interface RequestMold {
  url: string;
  httpParams: string;
  method: string;
  body: any;
}

export interface RequestUi {
  errorCode: number;
  method: string;
  url: string;
  delay?: number;
}

export interface RequestSort {
  prop: keyof RequestUi;
  direction: number;
}

export interface FailerRequest {
  errorCode: number;
  message: string;
  requestMold: RequestMold;
  requestId: string;
  delay: number;
}

type FailerEntities = Record<string, FailerRequest>;


const initialUi = (): RequestUi => ({
  method: 'any',
  url: '',
  errorCode: -2,
});

const initialSort = (): RequestSort => ({
  prop: null,
  direction: 0,
});

@Injectable()
export class FailerRequestsState {
  private entities$ = new BehaviorSubject<FailerEntities>({});
  private ui$ = new BehaviorSubject<RequestUi>(initialUi());
  private sort$ = new BehaviorSubject<RequestSort>(initialSort());

  constructor(
    private dbService: DbService<FailerRequest>,
  ) {
  }

  public async init(): Promise<void> {
    const entities = await this.dbService.retreiveAll().toPromise();
    this.set(entities);
  }

  public selectAllRaw(): Observable<FailerRequest[]> {
    return this.entities$.pipe(
      distinctUntilChanged(),
      map(entities => Object.values(entities)),
    );
  }

  public set(requests: FailerRequest[]) {
    const entities: Record<string, FailerRequest> = requests.reduce((acc, el) => {
      acc[el.requestId] = el;
      return acc;
    }, {});
    this.setEntities(entities);
  }

  public delete(requestId: string) {
    const entities = { ...this.entities$.value };
    delete entities[requestId];
    this.setEntities(entities);
    this.dbService.delete(requestId).subscribe();
  }

  private setEntities(entities: Record<string, FailerRequest>) {
    this.entities$.next(entities);
    console.log(entities);
  }

  public reset() {
    this.dbService.clear().subscribe();
    return this.setEntities({});
  }

  public getEntity(requestId: string): FailerRequest {
    return this.entities$.value[requestId];
  }

  public updateUi(ui: RequestUi): void {
    this.ui$.next({
      ...this.ui$.value,
      ...ui,
    });
  }

  public updateSort(sort: RequestSort): void {
    this.sort$.next({
      ...this.sort$.value,
      ...sort,
    });
  }

  public selectUi(): Observable<RequestUi> {
    return this.ui$.pipe(
      distinctUntilChanged(),
    );
  }

  public selectSort(): Observable<RequestSort> {
    return this.sort$.pipe(
      distinctUntilChanged(),
    );
  }

  public upsertEntity(request: Partial<FailerRequest>): void {
    const previous: FailerRequest = this.entities$.value[request.requestId] || {} as FailerRequest;
    const next: FailerRequest = {
      ...previous,
      ...request,
    };
    const entities: Record<string, FailerRequest> = {
      ...this.entities$.value,
      [request.requestId]: next,
    };

    this.setEntities(entities);

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
