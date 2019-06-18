import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignationsListComponent } from './view-designations-list.component';

describe('ViewDesignationsListComponent', () => {
  let component: ViewDesignationsListComponent;
  let fixture: ComponentFixture<ViewDesignationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDesignationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDesignationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
