import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetAssignDutyComponent } from './bottom-sheet-assign-duty.component';

describe('BottomSheetAssignDutyComponent', () => {
  let component: BottomSheetAssignDutyComponent;
  let fixture: ComponentFixture<BottomSheetAssignDutyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomSheetAssignDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomSheetAssignDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
