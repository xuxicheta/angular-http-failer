import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent implements OnInit {
  result$: Observable<HttpResponse<any> | HttpErrorResponse> = this.apiService.selectResult();
  time$ = this.apiService.selectTime();

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
  }

}
