import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  public async getRequest(): Promise<string> {
    return 'Hello World!';
  }
}
