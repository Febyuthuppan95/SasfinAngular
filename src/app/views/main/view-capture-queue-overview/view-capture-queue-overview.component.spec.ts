import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaptureQueueOverviewComponent } from './view-capture-queue-overview.component';

describe('ViewCaptureQueueOverviewComponent', () => {
  let component: ViewCaptureQueueOverviewComponent;
  let fixture: ComponentFixture<ViewCaptureQueueOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCaptureQueueOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaptureQueueOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
