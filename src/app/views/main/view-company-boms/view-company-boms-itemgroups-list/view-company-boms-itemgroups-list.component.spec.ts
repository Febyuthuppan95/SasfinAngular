import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBomsItemgroupsListComponent } from './view-company-boms-itemgroups-list.component';

describe('ViewCompanyBomsItemgroupsListComponent', () => {
  let component: ViewCompanyBomsItemgroupsListComponent;
  let fixture: ComponentFixture<ViewCompanyBomsItemgroupsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyBomsItemgroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyBomsItemgroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
