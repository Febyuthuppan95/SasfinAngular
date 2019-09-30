import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConversationTileComponent } from './chat-conversation-tile.component';

describe('ChatConversationTileComponent', () => {
  let component: ChatConversationTileComponent;
  let fixture: ComponentFixture<ChatConversationTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatConversationTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatConversationTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
