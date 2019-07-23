import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignationsRightsListComponent } from './view-designations-rights-list.component';

describe('ViewDesignationsRightsListComponent', () => {
  let component: ViewDesignationsRightsListComponent;
  let fixture: ComponentFixture<ViewDesignationsRightsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDesignationsRightsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDesignationsRightsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
