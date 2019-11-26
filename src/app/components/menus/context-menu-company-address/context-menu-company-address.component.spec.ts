import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyAddressComponent } from './context-menu-company-address.component';

describe('ContextMenuCompanyAddressComponent', () => {
  let component: ContextMenuCompanyAddressComponent;
  let fixture: ComponentFixture<ContextMenuCompanyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
