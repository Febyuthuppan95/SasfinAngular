import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuContactTypesComponent } from './context-menu-contact-types.component';

describe('ContextMenuContactTypesComponent', () => {
  let component: ContextMenuContactTypesComponent;
  let fixture: ComponentFixture<ContextMenuContactTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuContactTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuContactTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
