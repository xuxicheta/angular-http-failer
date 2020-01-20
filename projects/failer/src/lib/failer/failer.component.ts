import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FailerRequest, FailerRequestsState } from '../services/failer-requests.state';
import { FailerTableService } from '../services/failer-table.service';
import { FAILER_FORM, failerFormProvider } from './failer-form.provider';

@Component({
  selector: 'lib-failer',
  templateUrl: './failer.component.html',
  styleUrls: ['./failer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [FailerTableService, failerFormProvider],
})
export class FailerComponent implements OnInit, OnDestroy {
  private sub = new Subscription();

  public dataSource$ = this.failerTableService.selectDataSource();
  public displayedColumns = this.failerTableService.table.columns;
  public columnsHeaders = this.failerTableService.table.headers;

  get errorCodeControl() {
    return this.failerForm.get('errorCode') as FormControl;
  }

  constructor(
    private failerRequestsState: FailerRequestsState,
    private failerTableService: FailerTableService,
    @Inject(FAILER_FORM) public failerForm: FormGroup,
  ) { }

  ngOnInit() {
    this.sub.add(this.formSubscription());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onErrorToggle(errorCode: number, request: FailerRequest) {
    this.failerRequestsState.upsertEntity({
      requestId: request.requestId,
      errorCode,
    });
  }

  onError400Toggle(request: FailerRequest) {
    const errorCode = request.errorCode ? null : 400;

    this.failerRequestsState.upsertEntity({
      requestId: request.requestId,
      errorCode,
    });
  }

  onSort(direction: number, sortName: string) {
    console.log(direction, sortName);
  }

  private formSubscription(): Subscription {
    const sub1 = this.failerForm.valueChanges
      .subscribe(value => {
        this.failerRequestsState.updateUi(value);
      });

    const sub2 = this.failerRequestsState.selectUi()
      .subscribe(value => {
        this.failerForm.setValue(value, { emitEvent: false });
      });

    return new Subscription().add(sub1).add(sub2);
  }

  onClear() {
    this.failerRequestsState.reset();
  }

  onDelete(request: FailerRequest) {
    this.failerRequestsState.delete(request.requestId);
  }
}
