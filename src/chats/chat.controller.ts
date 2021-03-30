import { Body, Controller, Get, HttpException, Param, Post, Put, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { CurrentUser } from '../strategy';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { CreateChatDto, ChatIdDto, UpdateChatReadStatusDto, UpdateChatSendStatusDto } from './dtos';
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

  /**
   * @description Update chat message for read status and routes open only for admin, regular update use kafka event from client side
   * @admin
   * @put
   * @public
   * @param {IShare.UserInfo | IShare.JwtPayload} user
   * @param {ChatIdDto} chatIdDto
   * @param {UpdateChatReadStatusDto} updateChatReadStatusDto
   * @returns {Promise<IShare.IResponseBase<Chat> | HttpException>}
   */
  @Put('/:id/reads')
  @SetMetadata('roles', [EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  updateChatReadStatus(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Param(ValidationPipe) chatIdDto: ChatIdDto, @Body(ValidationPipe) updateChatReadStatusDto: UpdateChatReadStatusDto): Promise<IShare.IResponseBase<Chat> | HttpException> {
    return this.chatService.updateChatReadStatus(user, chatIdDto, updateChatReadStatusDto);
  }

  /**
   * @description Update chat message for send status and routes open only for admin, regular update use kafka event from client side
   * @admin
   * @put
   * @public
   * @param {IShare.UserInfo | IShare.JwtPayload} user
   * @param {ChatIdDto} chatIdDto
   * @param {UpdateChatSendStatusDto} updateChatSendStatusDto
   * @returns {Promise<IShare.IResponseBase<Chat> | HttpException>}
   */
  @Put('/:id/sends')
  @SetMetadata('roles', [EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  updateChatSendStatus(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Param(ValidationPipe) chatIdDto: ChatIdDto, @Body(ValidationPipe) updateChatSendStatusDto: UpdateChatSendStatusDto): Promise<IShare.IResponseBase<Chat> | HttpException> {
    return this.chatService.updateChatSendStatus(user, chatIdDto, updateChatSendStatusDto);
  }
}
