import { IsArray, IsInstance } from 'class-validator';
import { ChatRoom } from '../../chatrooms/chat-room.entity';
import { User } from '../../users/user.entity';

export class CreateChatParticiPantDto {
  @IsInstance(ChatRoom)
  chatRoom: ChatRoom;

  @IsArray()
  users: User[];
}
