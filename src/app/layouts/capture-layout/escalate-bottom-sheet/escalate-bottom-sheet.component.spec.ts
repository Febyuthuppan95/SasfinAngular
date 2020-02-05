import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalateBottomSheetComponent } from './escalate-bottom-sheet.component';

describe('EscalateBottomSheetComponent', () => {
  let component: EscalateBottomSheetComponent;
  let fixture: ComponentFixture<EscalateBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalateBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalateBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
