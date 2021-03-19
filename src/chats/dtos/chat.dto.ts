import { IsOptional, IsString, IsUUID } from 'class-validator';

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
