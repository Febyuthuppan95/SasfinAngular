import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLineLinkComponent } from './invoice-line-link.component';

describe('InvoiceLineLinkComponent', () => {
  let component: InvoiceLineLinkComponent;
  let fixture: ComponentFixture<InvoiceLineLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceLineLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceLineLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
