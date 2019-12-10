import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportQueuesListComponent } from './view-reportQueues-list.component';

describe('ViewReportsListComponent', () => {
  let component: ViewReportQueuesListComponent;
  let fixture: ComponentFixture<ViewReportQueuesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReportQueuesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportQueuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
