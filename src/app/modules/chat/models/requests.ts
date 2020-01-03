export class ChatConversationListRequest {

}

export class ChatConversationGetRequest {

}

export class ChatContactListRequest {

}

export class ChatSendMessageRequest {
conversationID: number;
receivingUserID: number;
userID: number;
message: string;
}
export class ChatConversationIssue {
    receivingUserID: number;
    fileType: string;
    documentID: number;
    userID: number;
}
