import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { User } from './types/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  public fetchOne(id: number) {

    return this.http.get<User>(`users/${id}`).pipe(
      shareReplay()
    );
  }
}
