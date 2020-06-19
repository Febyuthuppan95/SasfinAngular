import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBomsItemsListComponent } from './view-company-boms-items-list.component';

describe('ViewCompanyBomsItemsListComponent', () => {
  let component: ViewCompanyBomsItemsListComponent;
  let fixture: ComponentFixture<ViewCompanyBomsItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyBomsItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyBomsItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
