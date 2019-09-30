import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormImportClearingInstructionComponent } from './form-import-clearing-instruction.component';

describe('FormImportClearingInstructionComponent', () => {
  let component: FormImportClearingInstructionComponent;
  let fixture: ComponentFixture<FormImportClearingInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormImportClearingInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormImportClearingInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
