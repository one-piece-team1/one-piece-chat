import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { ChatService } from './chat.service';
import * as EUser from '../enums';

@Controller('/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @SetMetadata('roles', [EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getRequest(): Promise<string> {
    return this.chatService.getRequest();
  }
}
