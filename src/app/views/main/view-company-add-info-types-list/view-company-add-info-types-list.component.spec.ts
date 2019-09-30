import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyAddInfoTypesListComponent } from './view-company-add-info-types-list.component';

describe('ViewCompanyAddInfoTypesListComponent', () => {
  let component: ViewCompanyAddInfoTypesListComponent;
  let fixture: ComponentFixture<ViewCompanyAddInfoTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyAddInfoTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyAddInfoTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
