import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuAddressTypesComponent } from './context-menu-address-types.component';

describe('ContextMenuAddressTypesComponent', () => {
  let component: ContextMenuAddressTypesComponent;
  let fixture: ComponentFixture<ContextMenuAddressTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuAddressTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuAddressTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
