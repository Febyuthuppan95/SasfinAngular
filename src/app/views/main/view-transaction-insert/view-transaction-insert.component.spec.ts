import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionInsertComponent } from './view-transaction-insert.component';

describe('ViewTransactionInsertComponent', () => {
  let component: ViewTransactionInsertComponent;
  let fixture: ComponentFixture<ViewTransactionInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransactionInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
