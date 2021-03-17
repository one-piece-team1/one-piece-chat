import { IsIn, IsString, IsUUID } from 'class-validator';
import * as EChatRoom from '../enums';

class ChatRoomBaseDto {
  @IsUUID()
  id: string;
}

export class CreateChatRoomDto {
  @IsString()
  name: string;

  @IsIn([EChatRoom.EChatRoomType.PUBLIC, EChatRoom.EChatRoomType.PRIVATE, EChatRoom.EChatRoomType.GROUP])
  type: EChatRoom.EChatRoomType;

  @IsUUID()
  requestUserId: string;

  @IsUUID()
  responseUserId: string;
}

export class GetChatRoomByIdDto extends ChatRoomBaseDto {}
