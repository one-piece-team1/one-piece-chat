import { Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatRoomRepository');
}
