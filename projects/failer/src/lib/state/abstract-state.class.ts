import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class AbstractState<T> {
  protected store$: BehaviorSubject<T>;

  public create(initialValue: T) {
    this.store$ = new BehaviorSubject(initialValue);
  }

  public select() {
    return this.store$.asObservable();
  }

  public getValue() {
    return this.store$.value;
  }

  public set(value: T) {
    this.store$.next(value);
  }

  public update(value: Partial<T>) {
    this.set({
      ...this.store$.value,
      ...value,
    });
  }

  public destroy() {
    this.store$.complete();
    this.store$ = null;
  }
}

@Injectable()
export abstract class AbstractEntityState<T> extends AbstractState<Record<string, T>> {
  protected idKey: string;

  public createAll(idKey: string) {
    this.idKey = idKey;
    super.create({});
  }

  private mapping(values: T[]): Record<string, T> {
    return values.reduce((acc, el) => {
      acc[el[this.idKey]] = el;
      return acc;
    }, {} as Record<string, T>);
  }

  public setAll(values: T[]) {
    const entities = this.mapping(values);
    super.set(entities);
  }

  public selectAll(): Observable<T[]> {
    return this.store$.pipe(
      distinctUntilChanged(),
      map(entities => Object.values(entities)),
    );
  }

  public selectEntity(id: string) {
    return this.select().pipe(
      map(entities => entities[id]),
      distinctUntilChanged(),
    );
  }

  public getAll(): T[] {
    return Object.values(this.getValue());
  }

  public getEntity(id: string) {
    return this.getValue()[id];
  }

  public deleteEntity(id: string) {
    const entities = { ...this.getValue() };
    delete entities[id];
    this.store$.next(entities);
  }

  public upsertEntity(idKey: string, entity: Partial<T>): void {
    const previous: T = this.getEntity(entity[this.idKey]) || {} as T;
    const next: T = {
      ...previous,
      ...entity,
      [this.idKey]: idKey,
    };
    const entities: Record<string, T> = {
      ...this.store$.value,
      [this.idKey]: next,
    };

    this.store$.next(entities);
  }
}
