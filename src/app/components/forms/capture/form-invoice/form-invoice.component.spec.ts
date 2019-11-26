import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInvoiceComponent } from './form-invoice.component';

describe('FormInvoiceComponent', () => {
  let component: FormInvoiceComponent;
  let fixture: ComponentFixture<FormInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
