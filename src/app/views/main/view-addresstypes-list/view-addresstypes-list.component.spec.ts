import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddresstypesListComponent } from './view-addresstypes-list.component';

describe('ViewAdddresstypesListComponent', () => {
  let component: ViewAddresstypesListComponent;
  let fixture: ComponentFixture<ViewAddresstypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAddresstypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAddresstypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
