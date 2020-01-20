import { Injectable } from '@angular/core';
import { FailerRequestsState } from './failer-requests.state';

@Injectable()
export class FailerTableService {
  // private dataSource = new MatTableDataSource<FailerRequest>();
  public readonly table = this.createTableOptions();

  constructor(
    private failerRequestsState: FailerRequestsState,
  ) { }


  private createTableOptions() {
    const headers = {
      method: 'Method',
      url: 'Url',
      delay: 'Delay, ms',
      errorCode: 'ErrorCode',
      delete: ''
    };
    const columns = Object.keys(headers) as (keyof typeof headers)[];
    return { headers, columns};
  }
}
