import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactTypesListComponent } from './view-contact-types-list.component';

describe('ViewContactTypesListComponent', () => {
  let component: ViewContactTypesListComponent;
  let fixture: ComponentFixture<ViewContactTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContactTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContactTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
