import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCustomWorksheetComponent } from './form-custom-worksheet.component';

describe('FormCustomWorksheetComponent', () => {
  let component: FormCustomWorksheetComponent;
  let fixture: ComponentFixture<FormCustomWorksheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCustomWorksheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCustomWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
