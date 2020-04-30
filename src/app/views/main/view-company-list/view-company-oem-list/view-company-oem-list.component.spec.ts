import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyOemListComponent } from './view-company-oem-list.component';

describe('ViewCompanyOemListComponent', () => {
  let component: ViewCompanyOemListComponent;
  let fixture: ComponentFixture<ViewCompanyOemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyOemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyOemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
