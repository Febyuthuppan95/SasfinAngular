import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyContactsComponent } from './view-company-contacts.component';

describe('ViewCompanyContactsComponent', () => {
  let component: ViewCompanyContactsComponent;
  let fixture: ComponentFixture<ViewCompanyContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
