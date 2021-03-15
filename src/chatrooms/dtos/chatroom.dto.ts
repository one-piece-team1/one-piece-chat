import { IsIn, IsString, IsUUID } from 'class-validator';
import * as EChatRoom from '../enums';

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
