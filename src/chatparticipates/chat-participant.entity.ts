import { BaseEntity, BeforeInsert, BeforeUpdate, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ChatRoom } from '../chatrooms/chat-room.entity';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';

@Entity()
export class ChatParticipate extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @description Relation with chatroom
   */
  @OneToOne(
    () => ChatRoom,
    (chatRoom) => chatRoom.participateId,
  )
  @JoinColumn()
  chatRoomId: ChatRoom;

  /**
   * @description Relation with chat
   */
  @OneToMany(
    () => Chat,
    (chat) => chat.chatParticipateId,
  )
  @JoinColumn()
  messageIds: Chat[];

  /**
   * @description Relation with User
   */
  @ManyToMany(
    () => User,
    (user) => user.chatParticipateIds,
    { cascade: true },
  )
  @JoinTable()
  userIds: User[];

  /**
   * @description Time area
   */
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @BeforeInsert()
  updateWhenInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateDateWhenUpdate() {
    this.updatedAt = new Date();
  }
}
