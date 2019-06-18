import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBackgroundsListComponent } from './view-backgrounds-list.component';

describe('ViewBackgroundsListComponent', () => {
  let component: ViewBackgroundsListComponent;
  let fixture: ComponentFixture<ViewBackgroundsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBackgroundsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBackgroundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
