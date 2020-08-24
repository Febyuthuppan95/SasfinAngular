import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuPermitTypesComponent } from './context-menu-permit-types.component';

describe('ContextMenuPermitTypesComponent', () => {
  let component: ContextMenuPermitTypesComponent;
  let fixture: ComponentFixture<ContextMenuPermitTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuPermitTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuPermitTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
