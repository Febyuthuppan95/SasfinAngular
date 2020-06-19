import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEscalationReasonComponent } from './dialog-escalation-reason.component';

describe('DialogEscalationReasonComponent', () => {
  let component: DialogEscalationReasonComponent;
  let fixture: ComponentFixture<DialogEscalationReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEscalationReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEscalationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
