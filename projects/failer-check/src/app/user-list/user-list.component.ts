import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserListService } from '../user-list.service';
import { User } from '../types/user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  public users$ = this.usersService.fetchList('1');

  constructor(
    private usersService: UserListService,
  ) { }

  ngOnInit() {
  }

  public onUserClick(user: User) {
    this.usersService.setActive(user);
  }

}
