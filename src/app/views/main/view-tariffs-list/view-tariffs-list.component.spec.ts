import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextTariffsListComponent } from './view-tariffs-list.component';

describe('ContextTariffsListComponent', () => {
  let component: ContextTariffsListComponent;
  let fixture: ComponentFixture<ContextTariffsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextTariffsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextTariffsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
