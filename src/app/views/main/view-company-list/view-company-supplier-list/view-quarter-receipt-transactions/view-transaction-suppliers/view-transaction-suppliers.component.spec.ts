import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionSuppliersComponent } from './view-transaction-suppliers.component';

describe('ViewTransactionSuppliersComponent', () => {
  let component: ViewTransactionSuppliersComponent;
  let fixture: ComponentFixture<ViewTransactionSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransactionSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
