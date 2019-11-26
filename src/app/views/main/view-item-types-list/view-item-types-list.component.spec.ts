import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemTypesListComponent } from './view-item-types-list.component';

describe('ViewItemTypesListComponent', () => {
  let component: ViewItemTypesListComponent;
  let fixture: ComponentFixture<ViewItemTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewItemTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
