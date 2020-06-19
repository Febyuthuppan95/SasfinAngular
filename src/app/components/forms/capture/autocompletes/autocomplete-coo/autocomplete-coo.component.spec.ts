import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteCooComponent } from './autocomplete-coo.component';

describe('AutocompleteCooComponent', () => {
  let component: AutocompleteCooComponent;
  let fixture: ComponentFixture<AutocompleteCooComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteCooComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteCooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
