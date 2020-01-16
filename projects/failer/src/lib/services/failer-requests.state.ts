import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
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
}

export interface FailerRequest {
  errorCode: number;
  message: string;
  requestMold: RequestMold;
  requestId: string;
  delay: number;
}

type FailerEntities = Record<string, FailerRequest>;


function initialUiState(): RequestUi {
  return {
    method: 'any',
    url: '',
    errorCode: -2,
  };
}

@Injectable()
export class FailerRequestsState {
  private entities$ = new BehaviorSubject<FailerEntities>({});
  private ui$ = new BehaviorSubject<RequestUi>(initialUiState());

  constructor(
    private dbService: DbService<FailerRequest>,
  ) {
  }

  public async init(): Promise<void> {
    const entities = await this.dbService.retreiveAll().toPromise()
    this.set(entities);
  }

  public selectAll(): Observable<FailerRequest[]> {
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
    console.log(this.ui$.value);
  }

  public selectUi(): Observable<RequestUi> {
    return this.ui$.pipe(
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
      this.selectAll(),
      this.selectUi(),
    ]).pipe(
      map(([entities, ui]) => entities.filter(this.filterUi(ui)))
    );
  }
}
