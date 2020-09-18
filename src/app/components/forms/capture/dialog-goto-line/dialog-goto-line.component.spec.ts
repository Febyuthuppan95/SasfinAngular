import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGotoLineComponent } from './dialog-goto-line.component';

describe('DialogGotoLineComponent', () => {
  let component: DialogGotoLineComponent;
  let fixture: ComponentFixture<DialogGotoLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGotoLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGotoLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
