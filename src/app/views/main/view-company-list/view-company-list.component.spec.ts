import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyListComponent } from './view-company-list.component';

describe('ViewCompanyListComponent', () => {
  let component: ViewCompanyListComponent;
  let fixture: ComponentFixture<ViewCompanyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
