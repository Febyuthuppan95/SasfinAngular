import { Conversation } from './../components/chat-conversation-list/chat-conversation-list.component';
import { Outcome } from './../../../models/HttpResponses/DoctypeResponse';
export class ChatConversationListRequest {
    userID: number;
    rowStart: number;
    rowEnd: number;
    filter: string;

}

export class ChatConversationGetRequest {

}

export class ChatContactListRequest {

}
export class ChatConversationMessageList {
    conversationID: number;
    userID: number;
    rowStart: number;
    rowEnd: number;
}

export class ChatSendMessageRequest {
conversationID: number;
receivingUserID: number;
sendingUserID: number;
message: string;
}
export class ChatConversationIssue {
    reason: string;
    transactionID: number;
    fileType: string;
    documentID: number;
    userID: number;
}

