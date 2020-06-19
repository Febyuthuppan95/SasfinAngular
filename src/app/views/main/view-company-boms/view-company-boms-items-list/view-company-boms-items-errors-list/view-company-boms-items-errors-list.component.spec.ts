import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBomsItemsErrorsListComponent } from './view-company-boms-items-errors-list.component';

describe('ViewCompanyBomsItemsErrorsListComponent', () => {
  let component: ViewCompanyBomsItemsErrorsListComponent;
  let fixture: ComponentFixture<ViewCompanyBomsItemsErrorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyBomsItemsErrorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyBomsItemsErrorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
