import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShippingDocumentComponent } from './form-shipping-document.component';

describe('FormShippingDocumentComponent', () => {
  let component: FormShippingDocumentComponent;
  let fixture: ComponentFixture<FormShippingDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormShippingDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormShippingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
