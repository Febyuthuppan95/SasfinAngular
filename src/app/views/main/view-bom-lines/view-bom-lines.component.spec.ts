import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBOMLinesComponent } from './view-bom-lines.component';

describe('ViewBOMLinesComponent', () => {
  let component: ViewBOMLinesComponent;
  let fixture: ComponentFixture<ViewBOMLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBOMLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBOMLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
