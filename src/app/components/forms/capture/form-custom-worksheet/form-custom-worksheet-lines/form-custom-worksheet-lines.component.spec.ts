import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCustomWorksheetLinesComponent } from './form-custom-worksheet-lines.component';

describe('FormCustomWorksheetLinesComponent', () => {
  let component: FormCustomWorksheetLinesComponent;
  let fixture: ComponentFixture<FormCustomWorksheetLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCustomWorksheetLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCustomWorksheetLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
