import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveAttachmentComponent } from './dialog-remove-attachment.component';

describe('DialogRemoveAttachmentComponent', () => {
  let component: DialogRemoveAttachmentComponent;
  let fixture: ComponentFixture<DialogRemoveAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRemoveAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemoveAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
