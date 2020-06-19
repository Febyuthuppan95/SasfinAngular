import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteCPCComponent } from './autocomplete-cpc.component';

describe('AutocompleteCPCComponent', () => {
  let component: AutocompleteCPCComponent;
  let fixture: ComponentFixture<AutocompleteCPCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteCPCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteCPCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
