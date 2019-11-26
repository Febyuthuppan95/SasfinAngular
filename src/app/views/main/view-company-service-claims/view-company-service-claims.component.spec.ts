import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyServiceClaimsComponent } from './view-company-service-claims.component';

describe('ViewCompanyServiceClaimsComponent', () => {
  let component: ViewCompanyServiceClaimsComponent;
  let fixture: ComponentFixture<ViewCompanyServiceClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyServiceClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyServiceClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
