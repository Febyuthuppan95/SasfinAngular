import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentCaptureStatusBlockComponent } from './attachment-capture-status-block.component';

describe('AttachmentCaptureStatusBlockComponent', () => {
  let component: AttachmentCaptureStatusBlockComponent;
  let fixture: ComponentFixture<AttachmentCaptureStatusBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentCaptureStatusBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentCaptureStatusBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
