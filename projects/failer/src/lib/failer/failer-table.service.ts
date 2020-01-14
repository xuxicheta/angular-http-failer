import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FailerRequest, FailerRequestsState } from '../failer-requests.state';

const columnsHeaders = {
  method: 'Method',
  url: 'Url',
  errorCode: 'ErrorCode',
};
const displayedColumns = Object.keys(columnsHeaders) as (keyof typeof columnsHeaders)[];

@Injectable()
export class FailerTableService {
  // private dataSource = new MatTableDataSource<FailerRequest>();
  public displayedColumns = displayedColumns;
  public columnsHeaders = columnsHeaders;

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
}
