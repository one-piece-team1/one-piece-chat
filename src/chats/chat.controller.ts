import { Body, Controller, Get, HttpException, Post, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { CurrentUser } from '../strategy';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dtos';
import * as EShare from '../enums';
import * as IShare from '../interfaces';

@Controller('/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @SetMetadata('roles', [EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getRequest(): Promise<string> {
    return this.chatService.getRequest();
  }

  /**
   * @description Create chat message with transaction
   * @post
   * @transaction
   * @public
   * @param {IShare.UserInfo | IShare.JwtPayload} user
   * @param {CreateChatDto} createChatDto
   * @returns {Promise<IShare.IResponseBase<Chat> | HttpException>}
   */
  @Post()
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.VIP1, EShare.EUserRole.VIP2, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  createChat(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Body(ValidationPipe) createChatDto: CreateChatDto): Promise<IShare.IResponseBase<Chat> | HttpException> {
    return this.chatService.createChatMessage(user, createChatDto);
  }
}
