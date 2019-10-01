import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCurrenciesComponent } from './context-menu-currencies.component';

describe('ContextMenuCurrenciesComponent', () => {
  let component: ContextMenuCurrenciesComponent;
  let fixture: ComponentFixture<ContextMenuCurrenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCurrenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
