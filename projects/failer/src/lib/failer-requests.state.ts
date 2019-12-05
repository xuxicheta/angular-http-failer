import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { DbService } from './db.service';

export interface RequestMold {
  url: string;
  httpParams: string;
  method: string;
  body: any;
}

export interface RequestUi {
  method: string;
  url: string;
  error: string;
  code: string;
}

export interface FailerRequest {
  error: boolean;
  code: number;
  message: string;
  requestMold: RequestMold;
  requestId: string;
}

interface FailerRequestsEntityState {
  entities: Record<string, FailerRequest>;
  ui: RequestUi;
}

function initialState(): FailerRequestsEntityState {
  return {
    entities: {},
    ui: {
      method: 'any',
      url: '',
      error: 'any',
      code: '',
    }
  };
}

@Injectable({ providedIn: 'root' })
export class FailerRequestsState {
  private store$ = new BehaviorSubject<FailerRequestsEntityState>(initialState());

  constructor(
    private dbService: DbService<FailerRequest>,
  ) {
    this.dbService.retreiveAll()
      .subscribe(entities => {
        this.set(entities);
      });
  }

  public selectAll(): Observable<FailerRequest[]> {
    return this.store$.pipe(
      pluck('entities'),
      distinctUntilChanged(),
      map(entities => Object.values(entities)),
    );
  }

  public set(requests: FailerRequest[]) {
    this.store$.next({
      ...this.store$.value,
      entities: requests.reduce((acc, el) => {
        acc[el.requestId] = el;
        return acc;
      }, {}),
    });
  }

  public reset() {
    return this.set([]);
  }

  public getEntity(requestId: string): FailerRequest {
    return this.store$.value.entities[requestId];
  }

  public updateUi(ui: RequestUi): void {
    this.store$.next({
      ...this.store$.value,
      ui: {
        ...this.store$.value.ui,
        ...ui,
      },
    });
  }

  public selectUi(): Observable<RequestUi> {
    return this.store$.pipe(
      pluck('ui'),
      distinctUntilChanged(),
    );
  }

  public upsertEntity(request: Partial<FailerRequest>): void {
    let entities: Record<string, FailerRequest>;
    if (!this.getEntity(request.requestId)) {
      entities = {
        ...this.store$.value.entities,
        [request.requestId]: request as FailerRequest,
      };
    } else {
      entities = {
        ...this.store$.value.entities,
        [request.requestId]: {
          ...this.store$.value.entities[request.requestId],
          ...request,
        },
      };
    }

    this.store$.next({
      ...this.store$.value,
      entities,
    });

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
      if (ui.error === 'no') {
        condidions.push(!request.error);
      }
      if (ui.error === 'error') {
        condidions.push(request.error);
      }
      if (ui.code) {
        condidions.push(request.error && request.code.toString().includes(ui.code));
      }
      return condidions.every(Boolean);
    };
  }

  public selectAllFiltered(): Observable<FailerRequest[]> {
    return combineLatest([
      this.selectAll(),
      this.selectUi(),
    ]).pipe(
      map(([entities, ui]) => entities.filter(this.filterUi(ui)))
    );
  }
}
