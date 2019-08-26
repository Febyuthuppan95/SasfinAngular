import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdddresstypesListComponent } from './view-adddresstypes-list.component';

describe('ViewAdddresstypesListComponent', () => {
  let component: ViewAdddresstypesListComponent;
  let fixture: ComponentFixture<ViewAdddresstypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdddresstypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdddresstypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
