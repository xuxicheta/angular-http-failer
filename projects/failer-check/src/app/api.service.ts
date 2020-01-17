import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, ReplaySubject } from 'rxjs';
import { tap, catchError, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private result$ = new Subject<any>();
  private time$ = new ReplaySubject<number>(1);

  constructor(
    private http: HttpClient
  ) { }

  selectResult() {
    return this.result$.asObservable();
  }

  selectTime() {
    return this.time$.asObservable();
  }

  request(method: string, url: string, body = {}): Observable<any> {
    const start = performance.now();
    this.result$.next(null);
    this.time$.next(null);

    return this.http.request(method, url, {
      body,
      observe: 'events',
    })
      .pipe(
        filter(r => r.type === 4),
        catchError(err => of(err)),
        tap(this.result$),
        tap(() => this.time$.next(Math.round(performance.now() - start))),
      );
  }
}
