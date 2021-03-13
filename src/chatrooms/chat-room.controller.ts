import { Controller } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';

@Controller('/chatrooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}
}
