import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FailerRequest, FailerRequestsState } from '../failer-requests.state';
import { FailerTableService } from './failer-table.service';
import { HttpErrorsService } from './http-errors.service';

@Component({
  selector: 'lib-failer',
  templateUrl: './failer.component.html',
  styleUrls: ['./failer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [FailerTableService],
})
export class FailerComponent implements OnInit, OnDestroy {
  public dataSource$ = this.failerTableService.selectDataSource();
  public filterForm: FormGroup;
  private sub = new Subscription();
  public displayedColumns = this.failerTableService.displayedColumns;
  public columnsHeaders = this.failerTableService.columnsHeaders;

  constructor(
    private failerRequestsState: FailerRequestsState,
    private failerTableService: FailerTableService,
  ) { }

  ngOnInit() {
    this.filterForm = this.buildFilterForm();
    this.sub.add(this.formSubscription());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onErrorToggle(error: number, request: FailerRequest) {
    this.failerRequestsState.upsertEntity({
      requestId: request.requestId,
      errorCode: request.errorCode || 400,
    });
  }

  onErrorCodeChange(code: string, { requestId }: FailerRequest) {
    this.failerRequestsState.upsertEntity({
      requestId,
      errorCode: +code,
    });
  }

  onSort(direction: number, sortName: string) {

  }

  private buildFilterForm(): FormGroup {
    const form = new FormGroup({
      method: new FormControl(),
      url: new FormControl(),
      errorCode: new FormControl(),
    });

    return form;
  }

  private formSubscription(): Subscription {
    return new Subscription()
      .add(this.filterForm.valueChanges
        .subscribe(value => {
          this.failerRequestsState.updateUi(value);
        }))
      .add(this.failerRequestsState.selectUi()
        .subscribe(value => {
          this.filterForm.setValue(value, { emitEvent: false });
        }));
  }
}
