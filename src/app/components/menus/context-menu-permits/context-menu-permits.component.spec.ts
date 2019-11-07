import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuPermitsComponent } from './context-menu-permits.component';

describe('ContextMenuPermitsComponent', () => {
  let component: ContextMenuPermitsComponent;
  let fixture: ComponentFixture<ContextMenuPermitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuPermitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
