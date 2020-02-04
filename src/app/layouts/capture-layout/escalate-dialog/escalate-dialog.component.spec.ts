import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalateDialogComponent } from './escalate-dialog.component';

describe('EscalateDialogComponent', () => {
  let component: EscalateDialogComponent;
  let fixture: ComponentFixture<EscalateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
