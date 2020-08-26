import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyPermitsListComponent } from './view-company-permits-list.component';

describe('ViewCompanyPermitsListComponent', () => {
  let component: ViewCompanyPermitsListComponent;
  let fixture: ComponentFixture<ViewCompanyPermitsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyPermitsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyPermitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
