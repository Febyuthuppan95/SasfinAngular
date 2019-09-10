import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuDesignationrightsComponent } from './context-menu-designationrights.component';

describe('ContextMenuDesignationrightsComponent', () => {
  let component: ContextMenuDesignationrightsComponent;
  let fixture: ComponentFixture<ContextMenuDesignationrightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuDesignationrightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuDesignationrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
