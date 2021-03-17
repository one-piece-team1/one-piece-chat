import { Body, Controller, Get, Param, Post, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { CurrentUser } from '../strategy';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto, GetChatRoomByIdDto } from './dtos';
import * as EUser from '../enums';
import * as IShare from '../interfaces';

@Controller('/chatrooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('/:id')
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getChatRoomById(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Param(ValidationPipe) getChatRoomByIdDto: GetChatRoomByIdDto) {
    return this.chatRoomService.getChatRoomById(user, getChatRoomByIdDto);
  }

  @Post('/')
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  createChatRoom(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Body(ValidationPipe) createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.createChatRoom(user, createChatRoomDto);
  }
}
