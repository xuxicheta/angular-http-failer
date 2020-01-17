import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

type RequestParams = [string, string, any?];

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonsComponent implements OnInit {
  public urlList = this.createUrlList();

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
  }

  private createUrlList(): RequestParams[] {
    return [
      ['GET', 'users?page=1'],
      ['GET', 'users/1'],
      ['GET', 'users/2'],
      ['GET', 'users/3'],
      ['GET', 'users/4'],
      ['GET', 'users/5'],
      ['POST', 'users', {
        name: 'morpheus',
        job: 'leader'
      }],
      ['DELETE', 'users/2'],
      ['POST', 'register', { email: 'sydney@fife'}],
      ['PATCH', 'users/2', {
        name: 'morpheus',
        job: 'zion resident'
      }],
      ['PUT', 'users/2', {
        name: 'morpheus',
        job: 'zion resident'
      }],
      ['GET', 'products?page=1'],
      ['GET', 'products?page=2'],
      ['GET', 'items?page=1'],
    ];
  }

  onButtonClick(requestParam: RequestParams) {
    this.apiService.request(...requestParam)
      .subscribe(r => {
        console.log(r);
      });
  }

}
