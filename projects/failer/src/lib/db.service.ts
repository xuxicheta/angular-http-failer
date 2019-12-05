import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';

export const OBJECT_NAME = new InjectionToken<string>('indexedDbObjectName');
export const KEY_PATH = new InjectionToken<string>('indexedDbKeyPath');

@Injectable()
export class DbService<T = any> {
  private version = 1;
  private db$: Observable<IDBDatabase> = this.createDb();

  constructor(
    @Inject(OBJECT_NAME) private objectName: string,
    @Inject(KEY_PATH) private keyPath: string,
  ) { }

  private createDb(): Observable<IDBDatabase> {
    const openRequest: IDBOpenDBRequest = indexedDB.open(this.objectName, this.version);

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
    if (db.objectStoreNames.contains(this.objectName)) {
      return;
    }
    db.createObjectStore(this.objectName, { keyPath: this.keyPath });
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
    const transaction: IDBTransaction = db.transaction(this.objectName, mode);
    return transaction.objectStore(this.objectName);
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
