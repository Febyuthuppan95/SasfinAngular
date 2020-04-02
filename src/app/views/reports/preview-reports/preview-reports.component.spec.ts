import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewReportsComponent } from './preview-reports.component';

describe('PreviewReportsComponent', () => {
  let component: PreviewReportsComponent;
  let fixture: ComponentFixture<PreviewReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
