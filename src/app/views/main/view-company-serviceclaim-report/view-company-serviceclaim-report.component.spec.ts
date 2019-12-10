import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyServiceclaimReportComponent } from './view-company-serviceclaim-report.component';

describe('ViewCompanyServiceclaimReportComponent', () => {
  let component: ViewCompanyServiceclaimReportComponent;
  let fixture: ComponentFixture<ViewCompanyServiceclaimReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyServiceclaimReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyServiceclaimReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
