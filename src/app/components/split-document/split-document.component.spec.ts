import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitDocumentComponent } from './split-document.component';

describe('SplitDocumentComponent', () => {
  let component: SplitDocumentComponent;
  let fixture: ComponentFixture<SplitDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
