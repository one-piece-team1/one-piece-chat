import { Chat } from 'chats/chat.entity';
import { IsArray, IsInstance } from 'class-validator';
import { User } from '../../users/user.entity';

export class CreateChatParticiPantDto {
  @IsArray()
  users: User[];

  @IsInstance(Chat)
  chat: Chat;
}
