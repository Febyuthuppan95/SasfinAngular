import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReturnCaptureComponent } from './dialog-return-capture.component';

describe('DialogReturnCaptureComponent', () => {
  let component: DialogReturnCaptureComponent;
  let fixture: ComponentFixture<DialogReturnCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogReturnCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReturnCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
