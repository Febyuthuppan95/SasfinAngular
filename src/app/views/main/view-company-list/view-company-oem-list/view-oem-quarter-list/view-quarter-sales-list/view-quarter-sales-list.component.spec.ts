import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuarterSalesListComponent } from './view-quarter-sales-list.component';

describe('ViewQuarterSalesListComponent', () => {
  let component: ViewQuarterSalesListComponent;
  let fixture: ComponentFixture<ViewQuarterSalesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuarterSalesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuarterSalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
