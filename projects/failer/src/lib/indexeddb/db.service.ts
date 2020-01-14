import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';
import { FailerConfig, FAILER_CONFIG } from './db-config';

@Injectable()
export class DbService<T = any> {
  private version = 1;
  private db$: Observable<IDBDatabase> = this.createDb();

  constructor(
    @Inject(FAILER_CONFIG) private config: FailerConfig,
  ) { }

  private createDb(): Observable<IDBDatabase> {
    const openRequest: IDBOpenDBRequest = indexedDB.open(this.config.prefix + 'failer', this.version);

    openRequest.onupgradeneeded = (evt: IDBVersionChangeEvent) => this.onUpgradeNeeded(openRequest.result);

    return new Observable<IDBDatabase>(observer => {
      openRequest.onsuccess = (evt: Event) => {
        observer.next(openRequest.result);
        observer.complete();
      };
      openRequest.onerror = (evt: Event) => observer.error(openRequest.error);
    }).pipe(
      shareReplay(1),
    );
  }

  private onUpgradeNeeded(db: IDBDatabase): void {
    if (db.objectStoreNames.contains(this.config.objectName)) {
      return;
    }
    db.createObjectStore(this.config.objectName, { keyPath: this.config.keyPath });
  }

  public lay(value: T): Observable<IDBValidKey> {
    return this.db$.pipe(
      mergeMap((db: IDBDatabase) => this.fromIDBRequest(
        this.createIDBObjectStore(db, 'readwrite').put(value)
      )),
    );
  }

  public retreive(key: string): Observable<T> {
    return this.db$.pipe(
      mergeMap(db => this.fromIDBRequest(
        this.createIDBObjectStore(db, 'readonly').get(key)
      )),
    );
  }

  public retreiveAll(): Observable<T[]> {
    return this.db$.pipe(
      mergeMap(db => this.fromIDBRequest(
        this.createIDBObjectStore(db, 'readonly').getAll()
      )),
    );
  }

  private createIDBObjectStore(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
    const transaction: IDBTransaction = db.transaction(this.config.objectName, mode);
    return transaction.objectStore(this.config.objectName);
  }

  private fromIDBRequest<R>(idbRequest: IDBRequest<R>): Observable<R> {
    return new Observable<R>(observer => {
      idbRequest.onsuccess = (evt: Event) => {
        observer.next(idbRequest.result);
        observer.complete();
        evt.stopPropagation();
      };
      idbRequest.onerror = (evt: Event) => {
        observer.error(idbRequest.error);
        evt.stopPropagation();
      };
    });
  }

  public selectDb() {
    return this.db$;
  }
}
