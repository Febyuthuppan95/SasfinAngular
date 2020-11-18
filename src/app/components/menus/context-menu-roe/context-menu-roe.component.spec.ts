import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuRoeComponent } from './context-menu-roe.component';

describe('ContextMenuRoeComponent', () => {
  let component: ContextMenuRoeComponent;
  let fixture: ComponentFixture<ContextMenuRoeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuRoeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuRoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
