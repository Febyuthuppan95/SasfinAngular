import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserTileComponent } from './chat-user-tile.component';

describe('ChatUserTileComponent', () => {
  let component: ChatUserTileComponent;
  let fixture: ComponentFixture<ChatUserTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatUserTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatUserTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
