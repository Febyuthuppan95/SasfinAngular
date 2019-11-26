import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextSAD500Component } from './context-sad500.component';

describe('ContextSAD500Component', () => {
  let component: ContextSAD500Component;
  let fixture: ComponentFixture<ContextSAD500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextSAD500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextSAD500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
