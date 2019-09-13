import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyAddressesComponent } from './view-company-addresses.component';

describe('ViewCompanyAddressesComponent', () => {
  let component: ViewCompanyAddressesComponent;
  let fixture: ComponentFixture<ViewCompanyAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
