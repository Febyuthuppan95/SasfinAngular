import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DutyAssignDialogComponent } from './duty-assign-dialog.component';

describe('DutyAssignDialogComponent', () => {
  let component: DutyAssignDialogComponent;
  let fixture: ComponentFixture<DutyAssignDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DutyAssignDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DutyAssignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
