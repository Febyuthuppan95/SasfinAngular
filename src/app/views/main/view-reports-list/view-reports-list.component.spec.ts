import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportsListComponent } from './view-reports-list.component';

describe('ViewReportsListComponent', () => {
  let component: ViewReportsListComponent;
  let fixture: ComponentFixture<ViewReportsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReportsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
