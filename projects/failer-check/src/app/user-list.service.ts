import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { ApiResponse } from './core/response.interface';
import { ReplaySubject } from 'rxjs';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  private active$ = new ReplaySubject<User>(1);

  constructor(
    private http: HttpClient,
  ) { }

  public fetchList(page: string) {
    const params = new HttpParams({
      fromObject: { page },
    });
    return this.http.get<ApiResponse<User>>('users' , { params }).pipe(
      shareReplay()
    );
  }

  public setActive(user: User) {
    this.active$.next(user);
  }

  public selectActive() {
    return this.active$.asObservable();
  }
}
