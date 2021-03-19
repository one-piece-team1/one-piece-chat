import { Body, Controller, Get, Post, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { CurrentUser } from '../strategy';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dtos';
import * as EUser from '../enums';
import * as IShare from '../interfaces';

@Controller('/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @SetMetadata('roles', [EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getRequest(): Promise<string> {
    return this.chatService.getRequest();
  }

  @Post()
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  createChat(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Body(ValidationPipe) createChatDto: CreateChatDto) {
    return this.chatService.createChatMessage(user, createChatDto);
  }
}
