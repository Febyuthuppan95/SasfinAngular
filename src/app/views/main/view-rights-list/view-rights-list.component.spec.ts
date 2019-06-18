import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRightsListComponent } from './view-rights-list.component';

describe('ViewRightsListComponent', () => {
  let component: ViewRightsListComponent;
  let fixture: ComponentFixture<ViewRightsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRightsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRightsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
