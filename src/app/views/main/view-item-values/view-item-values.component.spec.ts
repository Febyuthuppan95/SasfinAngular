import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemValuesComponent } from './view-item-values.component';

describe('ViewItemValuesComponent', () => {
  let component: ViewItemValuesComponent;
  let fixture: ComponentFixture<ViewItemValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewItemValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
