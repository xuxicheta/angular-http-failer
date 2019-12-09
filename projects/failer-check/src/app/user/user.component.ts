import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserListService, User } from '../user-list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private usersService: UserListService,
  ) { }

  ngOnInit() {
    this.user$ = this.usersService.selectActive();
  }

}
