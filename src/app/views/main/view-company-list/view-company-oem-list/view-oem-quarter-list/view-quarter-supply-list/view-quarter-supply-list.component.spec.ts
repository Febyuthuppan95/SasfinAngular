import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuarterSupplyListComponent } from './view-quarter-supply-list.component';

describe('ViewQuarterSupplyListComponent', () => {
  let component: ViewQuarterSupplyListComponent;
  let fixture: ComponentFixture<ViewQuarterSupplyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuarterSupplyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuarterSupplyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
