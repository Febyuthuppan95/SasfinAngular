import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sad500LinesComponent } from './sad500-lines.component';

describe('Sad500LinesComponent', () => {
  let component: Sad500LinesComponent;
  let fixture: ComponentFixture<Sad500LinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sad500LinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sad500LinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
