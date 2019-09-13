import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddressTypesListComponent } from './view-address-types-list.component';

describe('ViewAddressTypesListComponent', () => {
  let component: ViewAddressTypesListComponent;
  let fixture: ComponentFixture<ViewAddressTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAddressTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAddressTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
