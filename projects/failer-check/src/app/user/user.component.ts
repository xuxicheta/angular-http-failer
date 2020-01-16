import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserListService } from '../user-list.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { User } from '../types/user.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
  user$: Observable<User> = this.userListService.selectActive();
  userFull$ = this.userFetching();

  constructor(
    private userListService: UserListService,
    private userService: UserService,
  ) { }

  ngOnInit() {

  }

  userFetching(): Observable<User> {
    return this.user$.pipe(
      switchMap(user => user && user.id && this.userService.fetchOne(user.id))
    );
  }



}
