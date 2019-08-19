import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaptureComponent } from './view-capture.component';

describe('ViewCaptureComponent', () => {
  let component: ViewCaptureComponent;
  let fixture: ComponentFixture<ViewCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
