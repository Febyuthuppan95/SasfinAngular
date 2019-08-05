import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnitsOfMeasureComponent } from './view-units-of-measure.component';

describe('ViewUnitsOfMeasureComponent', () => {
  let component: ViewUnitsOfMeasureComponent;
  let fixture: ComponentFixture<ViewUnitsOfMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUnitsOfMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUnitsOfMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
