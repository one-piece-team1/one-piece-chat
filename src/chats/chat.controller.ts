import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(): Promise<string> {
    return this.chatService.getRequest();
  }
}
