import { IEvent } from '@nestjs/cqrs';
import { CreateChatRoomDto } from '../dtos';

export class CreateChatRoomEvent implements IEvent {
  constructor(public readonly createChatRoomDto: CreateChatRoomDto) {}
}
