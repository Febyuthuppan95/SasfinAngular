import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPermitsListComponent } from './view-permits-list.component';

describe('ViewPermitsListComponent', () => {
  let component: ViewPermitsListComponent;
  let fixture: ComponentFixture<ViewPermitsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPermitsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPermitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
