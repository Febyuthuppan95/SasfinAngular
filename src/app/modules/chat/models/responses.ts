import { Outcome } from './../../../models/HttpResponses/DoctypeResponse';
export class ChatConversationListResponse {
    rowCount: number;
    outcome: Outcome;
    conversations: ConversationListItem[];
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

}
