export enum EChatRoomType {
  'PUBLIC' = 'public',
  'PRIVATE' = 'private',
  'GROUP' = 'group',
}

export enum EChatSendStatus {
  'FAIL' = 'fail',
  'SENDING' = 'sending',
  'FINISH' = 'finish',
}

export enum EChatStatus {
  'READ' = 'read',
  'UNREAD' = 'unread',
}

export enum EChatRoomSocketEvent {
  // chatroom settings
  'CREATECHATROOM' = 'createchatroom',
  'UPDATECHATROOM' = 'updatechatroom',
  'DELETECHATROOM' = 'deletechatroom',
  // participate
  'UPDATEPARTICIPATE' = 'updateparticipate',
  'DELETEPARTICIPATE' = 'deleteparticipate',
  // message
  'NEWCHATMESSAGE' = 'newchatmessage',
}
