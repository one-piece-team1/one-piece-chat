import { Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { ChatParticipate } from './chat-participant.entity';

@EntityRepository(ChatParticipate)
export class ChatParticipateRepository extends Repository<ChatParticipate> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatParticipateRepository');
}
