import { AggregateRoot } from '@nestjs/cqrs';
import { CreateChatRoomEvent } from '../events/chatroom.event';
import { CreateChatRoomDto } from '../dtos';

export class ChatRoomAggregate extends AggregateRoot {
  public createChatRoomDto: CreateChatRoomDto;

  setData(createChatRoomDto: CreateChatRoomDto) {
    this.createChatRoomDto = createChatRoomDto;
  }

  createChatRoomEvent() {
    this.apply(new CreateChatRoomEvent(this.createChatRoomDto));
  }
}
