import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuTariffsComponent } from './context-menu-tariffs.component';

describe('ContextMenuTariffsComponent', () => {
  let component: ContextMenuTariffsComponent;
  let fixture: ComponentFixture<ContextMenuTariffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuTariffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
