import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sad500LinePreviewComponent } from './sad500-line-preview.component';

describe('Sad500LinePreviewComponent', () => {
  let component: Sad500LinePreviewComponent;
  let fixture: ComponentFixture<Sad500LinePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sad500LinePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sad500LinePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
