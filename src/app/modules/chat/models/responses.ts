import { ChatNewMessage } from './signalr';
import { Conversation } from './../components/chat-conversation-list/chat-conversation-list.component';
import { Outcome } from './../../../models/HttpResponses/DoctypeResponse';
export class ChatConversationListResponse {
    rowCount: number;
    outcome: Outcome;
    conversations: Conversation[];
}


export class ConversationListItem {
    conversationID: number;
    lastMessage: string;
    messageDate: Date | string;
}
export class ChatContactListResponse {

}

export class ChatSendMessageResponse {
    messageID: number;
    outcome: Outcome;
}

export class ChatConversationGetResponse {
    rowCount: number;
    messages: ChatNewMessage[];
    outcome: Outcome;
}
