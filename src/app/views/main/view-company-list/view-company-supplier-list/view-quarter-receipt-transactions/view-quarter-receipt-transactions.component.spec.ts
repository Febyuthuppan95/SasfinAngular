import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuarterReceiptTransactionsComponent } from './view-quarter-receipt-transactions.component';

describe('ViewQuarterReceiptTransactionsComponent', () => {
  let component: ViewQuarterReceiptTransactionsComponent;
  let fixture: ComponentFixture<ViewQuarterReceiptTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuarterReceiptTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuarterReceiptTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
