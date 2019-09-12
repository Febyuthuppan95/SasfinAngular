import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuTransactionAttachmentComponent } from './context-menu-transaction-attachment.component';

describe('ContextMenuTransactionAttachmentComponent', () => {
  let component: ContextMenuTransactionAttachmentComponent;
  let fixture: ComponentFixture<ContextMenuTransactionAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuTransactionAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuTransactionAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
