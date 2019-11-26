import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextICIComponent } from './context-ici.component';

describe('ContextICIComponent', () => {
  let component: ContextICIComponent;
  let fixture: ComponentFixture<ContextICIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextICIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextICIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
