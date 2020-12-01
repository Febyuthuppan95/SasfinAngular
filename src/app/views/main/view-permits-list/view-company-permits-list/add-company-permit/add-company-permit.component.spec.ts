import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyPermitComponent } from './add-company-permit.component';

describe('AddCompanyPermitComponent', () => {
  let component: AddCompanyPermitComponent;
  let fixture: ComponentFixture<AddCompanyPermitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyPermitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
