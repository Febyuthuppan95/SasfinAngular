import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransactionDeleteComponent } from './dialog-transaction-delete.component';

describe('DialogTransactionDeleteComponent', () => {
  let component: DialogTransactionDeleteComponent;
  let fixture: ComponentFixture<DialogTransactionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTransactionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTransactionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
