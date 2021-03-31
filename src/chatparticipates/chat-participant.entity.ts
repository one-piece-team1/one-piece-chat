import { BaseEntity, BeforeInsert, BeforeUpdate, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn, VersionColumn } from 'typeorm';
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
    (chatRoom) => chatRoom.chatParticipate,
    { cascade: ['update'], eager: true },
  )
  chatRoom: ChatRoom;

  /**
   * @description Relation with chat
   */
  @OneToMany(
    () => Chat,
    (chat) => chat.chatParticipate,
    { cascade: true, eager: true },
  )
  @JoinColumn()
  chats: Chat[];

  /**
   * @description Relation with User
   */
  @ManyToMany(
    () => User,
    (user) => user.chatParticipates,
    { cascade: true, eager: true },
  )
  @JoinTable()
  users: User[];

  /**
   * @description Version control
   */
  @VersionColumn({ nullable: true })
  version: number;

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
