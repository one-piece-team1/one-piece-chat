import { Body, Controller, Get, HttpException, Param, Post, Query, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/local-guard';
import { CurrentUser } from '../strategy';
import { ChatRoom } from './chat-room.entity';
import { ChatRoomService } from './chat-room.service';
import { ChatSearchDto, CreateChatRoomDto, GetChatRoomByIdDto } from './dtos';
import * as EUser from '../enums';
import * as IShare from '../interfaces';

@Controller('/chatrooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('/paging')
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getUserChatRooms(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Query(ValidationPipe) searchDto: ChatSearchDto): Promise<IShare.IResponseBase<IShare.IChatRoomPagingResponseBase<ChatRoom[]>> | HttpException> {
    return this.chatRoomService.getUserChatRooms(user, searchDto);
  }

  @Get('/:id')
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getChatRoomById(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Param(ValidationPipe) getChatRoomByIdDto: GetChatRoomByIdDto): Promise<IShare.IResponseBase<ChatRoom> | HttpException> {
    return this.chatRoomService.getChatRoomById(user, getChatRoomByIdDto);
  }

  @Post('/')
  @SetMetadata('roles', [EUser.EUserRole.USER, EUser.EUserRole.VIP1, EUser.EUserRole.VIP2, EUser.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  createChatRoom(@CurrentUser() user: IShare.UserInfo | IShare.JwtPayload, @Body(ValidationPipe) createChatRoomDto: CreateChatRoomDto): Promise<IShare.IResponseBase<ChatRoom> | HttpException> {
    return this.chatRoomService.createChatRoom(user, createChatRoomDto);
  }
}
