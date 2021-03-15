import { Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { Chat } from './chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatRepository');
}
