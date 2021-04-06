import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import * as EChat from '../enums';

export class CreateChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  chatParitcipateId?: string;

  @IsUUID()
  requestUserId: string;

  @IsUUID()
  responseUserId: string;
}

export class ChatIdDto {
  @IsUUID()
  id: string;
}

export class UpdateChatReadStatusDto {
  @IsUUID()
  requestUserId: string;

  @IsIn([EChat.EChatStatus.READ])
  readStatus: EChat.EChatStatus;
}

export class UpdateChatSendStatusDto {
  @IsUUID()
  requestUserId: string;

  @IsIn([EChat.EChatSendStatus.FAIL, EChat.EChatSendStatus.FINISH])
  sendStatus: EChat.EChatSendStatus;
}
