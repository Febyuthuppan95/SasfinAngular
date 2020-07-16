import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySupplierContextMenuComponent } from './company-supplier-context-menu.component';

describe('CompanySupplierContextMenuComponent', () => {
  let component: CompanySupplierContextMenuComponent;
  let fixture: ComponentFixture<CompanySupplierContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySupplierContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySupplierContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
