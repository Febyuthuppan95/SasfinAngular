import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpGlossaryContextMenuComponent } from './help-glossary-context-menu.component';

describe('HelpGlossaryContextMenuComponent', () => {
  let component: HelpGlossaryContextMenuComponent;
  let fixture: ComponentFixture<HelpGlossaryContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpGlossaryContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpGlossaryContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
