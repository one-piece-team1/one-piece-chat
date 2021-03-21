export enum EChatRoomType {
  'PUBLIC' = 'public',
  'PRIVATE' = 'private',
  'GROUP' = 'group',
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
