import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuTransactionComponent } from './context-menu-transaction.component';

describe('ContextMenuTransactionComponent', () => {
  let component: ContextMenuTransactionComponent;
  let fixture: ComponentFixture<ContextMenuTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
