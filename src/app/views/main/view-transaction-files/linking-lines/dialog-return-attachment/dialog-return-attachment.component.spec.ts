import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReturnAttachmentComponent } from './dialog-return-attachment.component';

describe('DialogReturnAttachmentComponent', () => {
  let component: DialogReturnAttachmentComponent;
  let fixture: ComponentFixture<DialogReturnAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogReturnAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReturnAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
