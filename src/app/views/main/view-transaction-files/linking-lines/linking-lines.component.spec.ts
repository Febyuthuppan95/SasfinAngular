import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkingLinesComponent } from './linking-lines.component';

describe('LinkingLinesComponent', () => {
  let component: LinkingLinesComponent;
  let fixture: ComponentFixture<LinkingLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkingLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkingLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
