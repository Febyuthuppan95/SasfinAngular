import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuTransactionFileComponent } from './context-menu-transaction-file.component';

describe('ContextMenuTransactionFileComponent', () => {
  let component: ContextMenuTransactionFileComponent;
  let fixture: ComponentFixture<ContextMenuTransactionFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuTransactionFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuTransactionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
