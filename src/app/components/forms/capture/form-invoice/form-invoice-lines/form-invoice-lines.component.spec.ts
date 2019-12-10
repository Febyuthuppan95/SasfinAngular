import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInvoiceLinesComponent } from './form-invoice-lines.component';

describe('FormInvoiceLinesComponent', () => {
  let component: FormInvoiceLinesComponent;
  let fixture: ComponentFixture<FormInvoiceLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInvoiceLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInvoiceLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
