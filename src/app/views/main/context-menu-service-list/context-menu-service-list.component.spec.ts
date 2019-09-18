import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuServiceListComponent } from './context-menu-service-list.component';

describe('ContextMenuServiceListComponent', () => {
  let component: ContextMenuServiceListComponent;
  let fixture: ComponentFixture<ContextMenuServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
