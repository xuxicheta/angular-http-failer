import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FailerRequestsState } from '../state/failer-requests.state';
import { failerFormProvider, FAILER_FORM } from './providers/failer-form.provider';
import { failerTableProvider, FailerTableType, FAILER_TABLE } from './providers/failer-table.provider';
import { FailerRequest, RequestUi } from '../models';

@Component({
  selector: 'lib-failer',
  templateUrl: './failer.component.html',
  styleUrls: ['./failer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [failerTableProvider, failerFormProvider],
})
export class FailerComponent implements OnInit, OnDestroy {
  private sub = new Subscription();
  public dataSource$ = this.failerRequestsState.selectAll();

  get errorCodeControl() {
    return this.failerForm.get('errorCode') as FormControl;
  }

  constructor(
    private failerRequestsState: FailerRequestsState,
    @Inject(FAILER_TABLE) public readonly table: FailerTableType,
    @Inject(FAILER_FORM) public readonly failerForm: FormGroup,
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

  onSort(direction: number, prop: keyof RequestUi) {
    this.failerRequestsState.updateSort({
      direction,
      prop,
    });
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

  public trackBy(request: FailerRequest) {
    return request.requestId;
  }
}
