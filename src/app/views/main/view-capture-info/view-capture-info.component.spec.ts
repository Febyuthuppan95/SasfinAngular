import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaptureInfoComponent } from './view-capture-info.component';

describe('ViewCaptureInfoComponent', () => {
  let component: ViewCaptureInfoComponent;
  let fixture: ComponentFixture<ViewCaptureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCaptureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaptureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
