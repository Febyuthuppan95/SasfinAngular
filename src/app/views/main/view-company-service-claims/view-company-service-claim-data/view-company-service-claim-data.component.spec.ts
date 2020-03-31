import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyServiceClaimDataComponent } from './view-company-service-claim-data.component';

describe('ViewCompanyServiceClaimDataComponent', () => {
  let component: ViewCompanyServiceClaimDataComponent;
  let fixture: ComponentFixture<ViewCompanyServiceClaimDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyServiceClaimDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyServiceClaimDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
