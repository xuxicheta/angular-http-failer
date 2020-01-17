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
    ];
  }

  onButtonClick(requestParam: RequestParams) {
    this.apiService.request(...requestParam)
      .subscribe(r => {
        console.log(r);
      });
  }

}
