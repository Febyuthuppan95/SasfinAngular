import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuLocalAttachmentsComponent } from './context-menu-local-attachments.component';

describe('ContextMenuLocalAttachmentsComponent', () => {
  let component: ContextMenuLocalAttachmentsComponent;
  let fixture: ComponentFixture<ContextMenuLocalAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuLocalAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuLocalAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
