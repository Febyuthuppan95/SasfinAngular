import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuQuarterTransactionsComponent } from './context-menu-quarter-transactions.component';

describe('ContextMenuQuarterTransactionsComponent', () => {
  let component: ContextMenuQuarterTransactionsComponent;
  let fixture: ComponentFixture<ContextMenuQuarterTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuQuarterTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuQuarterTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
