import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBomsItemgroupsErrorsListComponent } from './view-company-boms-itemgroups-errors-list.component';

describe('ViewCompanyBomsItemgroupsErrorsListComponent', () => {
  let component: ViewCompanyBomsItemgroupsErrorsListComponent;
  let fixture: ComponentFixture<ViewCompanyBomsItemgroupsErrorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyBomsItemgroupsErrorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyBomsItemgroupsErrorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
