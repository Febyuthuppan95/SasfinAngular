import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEscalationsComponent } from './menu-escalations.component';

describe('MenuEscalationsComponent', () => {
  let component: MenuEscalationsComponent;
  let fixture: ComponentFixture<MenuEscalationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuEscalationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEscalationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
