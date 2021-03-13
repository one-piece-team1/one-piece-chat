import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}
}
