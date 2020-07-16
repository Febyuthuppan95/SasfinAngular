import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanySupplierListComponent } from './view-company-supplier-list.component';

describe('ViewCompanySupplierListComponent', () => {
  let component: ViewCompanySupplierListComponent;
  let fixture: ComponentFixture<ViewCompanySupplierListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanySupplierListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanySupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
