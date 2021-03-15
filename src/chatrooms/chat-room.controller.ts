import { Body, Controller, Post, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { CurrentUser } from '../strategy';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dtos';
import * as EUser from '../enums';
import * as IShare from '../interfaces';

@Controller('/chatrooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post('/')
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  createChatRoom(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Body(ValidationPipe) createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.createChatRoom(user, createChatRoomDto);
  }
}
