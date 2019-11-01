import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBOMsComponent } from './view-company-boms.component';

describe('ViewCompanyBOMsComponent', () => {
  let component: ViewCompanyBOMsComponent;
  let fixture: ComponentFixture<ViewCompanyBOMsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyBOMsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyBOMsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
