import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRedirectComponent } from './chat-redirect.component';

describe('ChatRedirectComponent', () => {
  let component: ChatRedirectComponent;
  let fixture: ComponentFixture<ChatRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
