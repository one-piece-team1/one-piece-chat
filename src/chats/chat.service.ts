import { Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger('ChatService');

  constructor(private readonly chatRepository: ChatRepository) {}

  public async getRequest(): Promise<string> {
    return 'Hello World!';
  }
}
