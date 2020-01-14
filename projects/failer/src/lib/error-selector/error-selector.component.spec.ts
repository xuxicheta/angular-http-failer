import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSelectorComponent } from './error-selector.component';

describe('ErrorSelectorComponent', () => {
  let component: ErrorSelectorComponent;
  let fixture: ComponentFixture<ErrorSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
