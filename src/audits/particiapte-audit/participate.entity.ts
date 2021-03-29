import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as EAudit from '../enums';

@Entity()
export class ParticipateAuditLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: EAudit.EAduitType,
    default: EAudit.EAduitType.CREATE,
    nullable: false,
  })
  type: EAudit.EAduitType;

  @Column({ type: 'int', nullable: false })
  version: number;

  @Column({ type: 'varchar', nullable: false })
  participateId: string;

  /**
   * @description Time area
   */
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @BeforeInsert()
  updateWhenInsert() {
    this.createdAt = new Date();
  }
}
