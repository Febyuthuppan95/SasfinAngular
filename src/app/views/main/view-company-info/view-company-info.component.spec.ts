import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyInfoComponent } from './view-company-info.component';

describe('ViewCompanyInfoComponent', () => {
  let component: ViewCompanyInfoComponent;
  let fixture: ComponentFixture<ViewCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
