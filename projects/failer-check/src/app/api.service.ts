import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private result$ = new Subject<any>();
  private time$ = new Subject<number>();

  constructor(
    private http: HttpClient
  ) { }

  selectResult() {
    return this.result$.asObservable();
  }

  selectTime() {
    return this.time$.asObservable();
  }

  request(method: string, url: string, body = {}): Observable<any>  {
    const start = performance.now();
    this.result$.next(null);
    this.time$.next(null);

    return (() => {
      switch (method) {
        case 'POST': return this.http.post(url, body);
        case 'PUT': return this.http.put(url, body);
        case 'DELETE': return this.http.delete(url);
        case 'PATCH': return this.http.patch(url, body);
        case 'GET':
        default:
          return this.http.get(url);
      }})().pipe(
        catchError(err => of(err)),
        tap(r => this.result$.next(r)),
        tap(() => this.time$.next(Math.round(performance.now() - start))),
      );
  }
}
