import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextCompanyItemsListComponent } from './view-company-items-list.component';

describe('ContextCompanyItemsListComponent', () => {
  let component: ContextCompanyItemsListComponent;
  let fixture: ComponentFixture<ContextCompanyItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextCompanyItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextCompanyItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
