import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaptureLandingComponent } from './view-capture-landing.component';

describe('ViewCaptureLandingComponent', () => {
  let component: ViewCaptureLandingComponent;
  let fixture: ComponentFixture<ViewCaptureLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCaptureLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaptureLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
