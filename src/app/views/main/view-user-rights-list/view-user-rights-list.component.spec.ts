import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserRightsListComponent } from './view-user-rights-list.component';

describe('ViewUserRightsListComponent', () => {
  let component: ViewUserRightsListComponent;
  let fixture: ComponentFixture<ViewUserRightsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserRightsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserRightsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
