import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHelpGlossaryComponent } from './view-help-glossary.component';

describe('ViewHelpGlossaryComponent', () => {
  let component: ViewHelpGlossaryComponent;
  let fixture: ComponentFixture<ViewHelpGlossaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHelpGlossaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHelpGlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
