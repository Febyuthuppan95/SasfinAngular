import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSAD500Component } from './view-sad500.component';

describe('ViewSAD500Component', () => {
  let component: ViewSAD500Component;
  let fixture: ComponentFixture<ViewSAD500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSAD500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSAD500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
