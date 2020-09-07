import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHelpComponent } from './create-help.component';

describe('CreateHelpComponent', () => {
  let component: CreateHelpComponent;
  let fixture: ComponentFixture<CreateHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
