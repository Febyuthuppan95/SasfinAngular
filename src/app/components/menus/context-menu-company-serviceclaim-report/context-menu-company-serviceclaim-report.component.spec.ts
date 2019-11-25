import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyServiceclaimReportComponent } from './context-menu-company-serviceclaim-report.component';

describe('ContextMenuCompanyServiceclaimReportComponent', () => {
  let component: ContextMenuCompanyServiceclaimReportComponent;
  let fixture: ComponentFixture<ContextMenuCompanyServiceclaimReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyServiceclaimReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyServiceclaimReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
