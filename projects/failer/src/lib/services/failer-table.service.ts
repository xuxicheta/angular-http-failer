import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FailerRequest, FailerRequestsState } from './failer-requests.state';



@Injectable()
export class FailerTableService {
  // private dataSource = new MatTableDataSource<FailerRequest>();
  public readonly table = this.createTableOptions();

  constructor(
    private failerRequestsState: FailerRequestsState,
  ) { }

  // setSort(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }

  // selectDataSource(): Observable<MatTableDataSource<FailerRequest>> {
  //   return this.failerRequestsState.selectAllFiltered().pipe(
  //     map(data => {
  //       this.dataSource.data = data;
  //       return this.dataSource;
  //     }),
  //   );
  // }

  selectDataSource(): Observable<FailerRequest[]> {
    return this.failerRequestsState.selectAllFiltered().pipe(
      // map(data => {
      //   this.dataSource.data = data;
      //   return this.dataSource;
      // }),
    );
  }

  private createTableOptions() {
    const headers = {
      method: 'Method',
      url: 'Url',
      delay: 'Delay, ms',
      errorCode: 'ErrorCode',
    };
    const columns = Object.keys(headers) as (keyof typeof headers)[];
    return { headers, columns};
  }
}
