import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCheckingScreenComponent } from './view-checking-screen.component';

describe('ViewCheckingScreenComponent', () => {
  let component: ViewCheckingScreenComponent;
  let fixture: ComponentFixture<ViewCheckingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCheckingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCheckingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
