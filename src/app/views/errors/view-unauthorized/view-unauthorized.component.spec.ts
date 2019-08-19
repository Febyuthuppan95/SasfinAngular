import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnauthorizedComponent } from './view-unauthorized.component';

describe('ViewUnauthorizedComponent', () => {
  let component: ViewUnauthorizedComponent;
  let fixture: ComponentFixture<ViewUnauthorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUnauthorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
