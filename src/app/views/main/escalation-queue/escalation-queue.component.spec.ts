import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationQueueComponent } from './escalation-queue.component';

describe('EscalationQueueComponent', () => {
  let component: EscalationQueueComponent;
  let fixture: ComponentFixture<EscalationQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalationQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
