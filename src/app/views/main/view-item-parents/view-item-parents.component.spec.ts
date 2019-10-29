import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemParentsComponent } from './view-item-parents.component';

describe('ViewItemParentsComponent', () => {
  let component: ViewItemParentsComponent;
  let fixture: ComponentFixture<ViewItemParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewItemParentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
