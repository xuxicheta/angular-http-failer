import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { failerFormProvider, FAILER_FORM } from './providers/failer-form.provider';
import { failerTableProvider, FailerTableType, FAILER_TABLE } from './providers/failer-table.provider';
import { FailerRequest, RequestUi } from '../models';
import { FailerUiState } from '../state/failer-ui.state';
import { FailerSortState } from '../state/failer-sort.state';
import { FailerEntitiesState } from '../state/failer-entities.state';
import { FailerMediator } from '../state/failer.mediator';

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
  public dataSource$ = this.failerMediator.selectAll();

  get errorCodeControl() {
    return this.failerForm.get('errorCode') as FormControl;
  }

  constructor(
    private failerUiState: FailerUiState,
    private failerSortState: FailerSortState,
    private failerEntitiesState: FailerEntitiesState,
    private failerMediator: FailerMediator,
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
    this.failerEntitiesState.upsertEntity(request.requestId, {
      errorCode,
    });
  }

  onError400Toggle(request: FailerRequest) {
    const errorCode = request.errorCode ? null : 400;

    this.failerEntitiesState.upsertEntity(request.requestId, {
      errorCode,
    });
  }

  onSort(direction: number, prop: keyof RequestUi) {
    this.failerSortState.update({
      direction,
      prop,
    });
  }

  private formSubscription(): Subscription {
    const sub1 = this.failerForm.valueChanges
      .subscribe(value => {
        this.failerUiState.update(value);
      });

    const sub2 = this.failerUiState.select()
      .subscribe(value => {
        this.failerForm.setValue(value, { emitEvent: false });
      });

    return new Subscription().add(sub1).add(sub2);
  }

  onClear() {
    this.failerEntitiesState.reset();
  }

  onDelete(request: FailerRequest) {
    this.failerEntitiesState.deleteEntity(request.requestId);
  }

  public trackBy(request: FailerRequest) {
    return request.requestId;
  }
}
